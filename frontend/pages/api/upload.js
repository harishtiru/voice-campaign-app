import nextConnect from "next-connect";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { MongoClient } from "mongodb";

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect({
  onError(err, req, res) {
    console.error(err);
    res.status(500).json({ error: err.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
});

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const buffer = req.file.buffer;

  let records;
  try {
    // parse CSV buffer to array of objects (header row required)
    records = parse(buffer, { columns: true, skip_empty_lines: true, trim: true });
  } catch (err) {
    console.error("CSV parse error", err);
    return res.status(400).json({ error: "CSV parse error: " + err.message });
  }

  if (!Array.isArray(records) || records.length === 0) {
    return res.json({ message: "No rows", count: 0 });
  }

  // add createdAt and optionally normalize phone field name (example: phone)
  const docs = records.map(r => ({ ...r, createdAt: new Date() }));

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB || "voice_campaign");
    const result = await db.collection("contacts").insertMany(docs);
    res.json({ message: "Inserted", count: result.insertedCount });
  } catch (err) {
    console.error("DB insert error", err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

export const config = { api: { bodyParser: false } };
export default handler;
