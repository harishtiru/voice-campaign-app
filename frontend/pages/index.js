import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1>Voice Campaign Dashboard</h1>
      <p>
        <Link href="/upload">Upload Contacts CSV</Link>
      </p>
      <p>
        <Link href="/create-campaign">Create Campaign</Link>
      </p>
    </div>
  );
}
