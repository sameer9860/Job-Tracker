import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import API from "../services/api";

const columns = ["applied", "interview", "offer", "rejected"];

function KanbanBoard({ jobsData }) {
  const [jobs, setJobs] = useState(jobsData || []);

  const onDragEnd = async (result) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const jobId = draggableId;
    const newStatus = destination.droppableId;

    // Update frontend
    setJobs((prev) =>
      prev.map((job) =>
        job.id === parseInt(jobId) ? { ...job, status: newStatus } : job
      )
    );

    // Update backend
    try {
      await API.patch(`jobs/${jobId}/update_status/`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  minHeight: "300px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <h4 style={{ textTransform: "capitalize" }}>{col}</h4>

                {jobs
                  .filter((job) => job.status === col)
                  .map((job, index) => (
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
                            padding: "10px",
                            marginBottom: "10px",
                            background: "#fff",
                            borderRadius: "6px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {job.company} - {job.role}
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
