// app/jobs/page.tsx
import Navbar from "../components/Navbar";
import JobClient from "./components/JobClient";

export default function JobsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar/>
      <JobClient />
    </div>
  );
}
