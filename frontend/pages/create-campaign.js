import { useState } from "react";

export default function CreateCampaign() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxConcurrency, setMaxConcurrency] = useState(200);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("Creating...");
    try {
      const res = await fetch("/api/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, startTime, maxConcurrency })
      });
      const data = await res.json();
      if (res.ok) setMsg("Created campaign: " + data.campaignId);
      else setMsg("Error: " + (data.error || JSON.stringify(data)));
    } catch (err) {
      setMsg("Error: " + String(err));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Campaign</h2>
      <form onSubmit={submit}>
        <div>
          <label>Campaign name<br />
            <input value={name} onChange={e => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>Start time (UTC)<br />
            <input value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="YYYY-MM-DDTHH:MM:SSZ" required />
          </label>
        </div>
        <div>
          <label>Max concurrency<br />
            <input type="number" value={maxConcurrency} onChange={e => setMaxConcurrency(Number(e.target.value))} />
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Create</button>
        </div>
      </form>
      <p>{msg}</p>
    </div>
  );
}

