import { useState } from "react";
import { useRouter } from "next/router";

export default function UploadPage() {
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Inserted ${data.count} rows`);
      } else {
        setStatus("Upload failed: " + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      setStatus("Upload error: " + String(err));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Upload contacts CSV</h2>
      <input type="file" accept=".csv" onChange={handleFile} />
      <p>{status}</p>
      <p><button onClick={() => router.push("/")}>Back</button></p>
    </div>
  );
}
