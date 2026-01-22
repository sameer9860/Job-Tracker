import { useEffect, useState } from "react";
import API from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const columns = ["applied", "interview", "offer", "rejected"];

function KanbanBoard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("jobs/").then((res) => setJobs(res.data));
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const jobId = Number(draggableId);
    const newStatus = destination.droppableId;

    try {
      // ✅ backend update
      await API.patch(`jobs/${jobId}/`, {
        status: newStatus,
      });

      // ✅ FRONTEND STATE UPDATE (THIS WAS MISSING)
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error("Failed to update job status", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "16px", padding: "20px" }}>
        {columns.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  background: "#f4f4f4",
                  padding: "12px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ textTransform: "capitalize" }}>{status}</h3>

                {jobs
                  .filter((job) => job.status === status)
                  .map((job, index) => (
                    <Draggable
                      key={job.id}
                      draggableId={job.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: "#fff",
                            padding: "10px",
                            marginBottom: "8px",
                            borderRadius: "6px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{job.company}</strong>
                          <div>{job.role}</div>
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
  );
}

export default KanbanBoard;
