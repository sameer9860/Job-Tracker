import { useEffect, useState } from "react";
import API from "../services/api";

const columns = ["applied", "interview", "offer", "rejected"];

function Kanban() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("jobs/")
      .then((res) => setJobs(res.data))
      .catch(() => {
        window.location.href = "/";
      });
  }, []);

  const groupedJobs = (status) =>
    jobs.filter((job) => job.status === status);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Job Applications Kanban</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((status) => (
          <div
            key={status}
            style={{
              flex: 1,
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ textTransform: "capitalize" }}>{status}</h3>

            {groupedJobs(status).map((job) => (
              <div
                key={job.id}
                style={{
                  background: "#fff",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <strong>{job.company}</strong>
                <p>{job.role}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kanban;
