import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../services/api";

const columnsOrder = ["applied", "interview", "offer", "rejected"];
const columnColors = {
  applied: "#2563eb",
  interview: "#f59e0b",
  offer: "#10b981",
  rejected: "#ef4444",
};

function KanbanBoard({ jobsData, theme = "light", onStatusChange }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setJobs(jobsData || []);
  }, [jobsData]);

  const groupedJobs = (status) => jobs.filter((job) => job.status === status);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const jobId = parseInt(draggableId);
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus === destStatus) return; // no change

    // Update UI immediately
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: destStatus } : job
      )
    );

    // Notify parent dashboard
    if (onStatusChange) onStatusChange(jobId, sourceStatus, destStatus);

    // Update backend
    try {
      await API.patch(`jobs/${jobId}/`, { status: destStatus });
    } catch (err) {
      console.error("Failed to update job status:", err);
      // Revert UI on error
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: sourceStatus } : job
        )
      );
    }
  };

  const isDark = theme === "dark";
  const cardStyle = (status) => ({
    background: isDark ? "#2d2d3d" : "#fff",
    borderLeft: `6px solid ${columnColors[status]}`,
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: isDark ? "0 2px 6px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.1)",
    color: isDark ? "#f3f4f6" : "#1f2937",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Job Applications Kanban</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
          {columnsOrder.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: "1 0 220px",
                    background: isDark ? "#1f1f2e" : "#f4f4f4",
                    padding: "10px",
                    borderRadius: "10px",
                    minHeight: "400px",
                  }}
                >
                  <h3 style={{ textTransform: "capitalize", color: columnColors[status] }}>
                    {status}
                  </h3>
                  {groupedJobs(status).map((job, index) => (
                    <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...cardStyle(status), ...provided.draggableProps.style }}
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

export default KanbanBoard;
