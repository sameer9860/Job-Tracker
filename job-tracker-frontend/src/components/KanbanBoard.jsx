import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../services/api";

const STATUSES = ["applied", "interview", "offer", "rejected"];
const STATUS_LABELS = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

function KanbanBoard({ jobsData }) {
  const [columns, setColumns] = useState({});

  // Initialize columns from jobsData
  useEffect(() => {
    const colData = {};
    STATUSES.forEach((status) => {
      colData[status] = jobsData.filter((job) => job.status === status);
    });
    setColumns(colData);
  }, [jobsData]);

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // Dropped outside
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];

    // Find dragged job
    const [movedJob] = sourceCol.splice(source.index, 1);
    movedJob.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedJob);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    // 🔁 Update backend
    try {
      await API.patch(`jobs/${draggableId}/`, { status: destination.droppableId });
    } catch (err) {
      console.error("Failed to update job status:", err);
    }
  };

  return (
    <div style={styles.boardContainer}>
      <DragDropContext onDragEnd={onDragEnd}>
        {STATUSES.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={styles.column}
              >
                <h3 style={styles.columnTitle}>{STATUS_LABELS[status]}</h3>
                {columns[status]?.map((job, index) => (
                  <Draggable key={job.id} draggableId={`${job.id}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...styles.card,
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? "#e0e7ff" : "#fff",
                        }}
                      >
                        <p style={styles.cardTitle}>{job.company}</p>
                        <p style={styles.cardRole}>{job.role}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  boardContainer: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    padding: "0 30px 30px",
  },
  column: {
    minWidth: "220px",
    background: "#f3f4f6",
    padding: "15px",
    borderRadius: "10px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    maxHeight: "70vh",
    overflowY: "auto",
  },
  columnTitle: {
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#4f46e5",
  },
  card: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    cursor: "grab",
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: "4px",
    fontSize: "14px",
  },
  cardRole: {
    fontSize: "12px",
    color: "#555",
  },
};

export default KanbanBoard;
