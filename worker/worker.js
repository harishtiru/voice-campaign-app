import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";
import Redis from "ioredis";
import axios from "axios";

const MONGO_URI = process.env.MONGODB_URI;
const MONGO_DB = process.env.MONGO_DB || "voice_campaign";
const REDIS_URL = process.env.REDIS_URL;
const TELEPHONY_URL = process.env.TELEPHONY_API_URL;

if (!MONGO_URI) {
  console.error("MONGODB_URI required");
  process.exit(1);
}

const redis = REDIS_URL ? new Redis(REDIS_URL) : null;

async function processCampaign(db, campaign) {
  console.log("Starting campaign", campaign._id.toString());
  const campaignId = campaign._id.toString();
  const maxConc = campaign.maxConcurrency || 200;

  const contactsCursor = db.collection("contacts").find({ campaignId: campaign._id.toString() });

  for await (const contact of contactsCursor) {
    // Wait until concurrency available
    while (true) {
      const active = Number(await (redis ? redis.get(`campaign:${campaignId}:active`) : Promise.resolve(0)) || 0);
      if (active < maxConc) break;
      await new Promise(r => setTimeout(r, 200));
    }

    if (redis) await redis.incr(`campaign:${campaignId}:active`);

    // Dispatch call asynchronously (do not await to keep loop fast)
    (async () => {
      try {
        // Example POST to telephony provider - replace with your provider's API
        if (TELEPHONY_URL && contact.phone) {
          await axios.post(TELEPHONY_URL, { to: contact.phone, metadata: { campaignId } }, { timeout: 30000 });
        } else {
          // simulate delay in absence of real provider
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (err) {
        console.error("Call failed", err?.message || err);
      } finally {
        if (redis) await redis.decr(`campaign:${campaignId}:active`);
      }
    })();
  }

  // mark campaign completed
  await db.collection("campaigns").updateOne({ _id: campaign._id }, { $set: { status: "COMPLETED", completedAt: new Date() } });
  console.log("Completed campaign", campaign._id.toString());
}

async function startWorker() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(MONGO_DB);
  console.log("Worker connected to DB");

  // Poll loop
  setInterval(async () => {
    try {
      const now = new Date();
      const campaigns = await db.collection("campaigns").find({ status: "SCHEDULED", startTime: { $lte: now } }).toArray();

      for (const c of campaigns) {
        // claim campaign atomically
        const claimed = await db.collection("campaigns").findOneAndUpdate(
          { _id: c._id, status: "SCHEDULED" },
          { $set: { status: "RUNNING", startedAt: new Date() } }
        );
        if (!claimed.value) continue;
        // attach campaignId to contacts if not already set — optional
        await db.collection("contacts").updateMany(
          { campaignId: { $exists: false }, uploadedAtCampaignTemp: c.uploadTag || null },
          { $set: { campaignId: c._id.toString() } }
        );

        // process
        await processCampaign(db, c);
      }
    } catch (err) {
      console.error("Worker loop error", err);
    }
  }, 5000);
}

startWorker().catch(err => {
  console.error("Worker start failed", err);
  process.exit(1);
});
