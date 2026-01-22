import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../services/api";

// The columns
const columns = ["applied", "interview", "offer", "rejected"];

function Kanban() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await API.get("jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle drag & drop
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // dropped outside

    const draggedJob = jobs.find((job) => job.id === parseInt(draggableId));

    // If dropped in same column, do nothing
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

    try {
      // Update backend
      await API.patch(`jobs/${draggedJob.id}/`, { status: newStatus });

      // Update frontend state
      setJobs((prev) =>
        prev.map((job) =>
          job.id === draggedJob.id ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Group jobs by status
  const groupedJobs = (status) => jobs.filter((job) => job.status === status);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading jobs...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Job Applications Kanban</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {columns.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "8px",
                    minHeight: "400px",
                  }}
                >
                  <h3 style={{ textTransform: "capitalize" }}>{status}</h3>

                  {groupedJobs(status).map((job, index) => (
                    <Draggable
                      draggableId={job.id.toString()}
                      index={index}
                      key={job.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: "#fff",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "6px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{job.company}</strong>
                          <p>{job.role}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Kanban;

