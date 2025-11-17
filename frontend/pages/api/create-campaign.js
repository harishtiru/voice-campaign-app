import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { name, startTime, maxConcurrency } = payload;
  if (!name || !startTime) return res.status(400).json({ error: "name and startTime required" });

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB || "voice_campaign");

    const camp = {
      name,
      startTime: new Date(startTime),
      maxConcurrency: Number(maxConcurrency || 200),
      status: "SCHEDULED",
      createdAt: new Date()
    };

    const r = await db.collection("campaigns").insertOne(camp);
    res.json({ success: true, campaignId: r.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
}
