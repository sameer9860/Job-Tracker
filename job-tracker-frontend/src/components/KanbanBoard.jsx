import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const initialData = {
  Applied: [
    { id: "1", company: "Google", role: "Frontend Developer" },
    { id: "2", company: "Meta", role: "React Engineer" },
  ],
  Interview: [
    { id: "3", company: "Amazon", role: "SDE I" },
  ],
  Offer: [],
  Rejected: [],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = [...columns[sourceCol]];
    const destItems = [...columns[destCol]];

    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({ ...columns, [sourceCol]: sourceItems });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceCol]: sourceItems,
        [destCol]: destItems,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.board}>
        {Object.entries(columns).map(([columnId, items]) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={styles.column}
              >
                <h3>{columnId}</h3>

                {items.map((item, index) => (
                  <Draggable
                    draggableId={item.id}
                    index={index}
                    key={item.id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...styles.card,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <strong>{item.company}</strong>
                        <p>{item.role}</p>
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

const styles = {
  board: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },
  column: {
    background: "#f4f6fa",
    padding: "15px",
    borderRadius: "10px",
    width: "250px",
    minHeight: "400px",
  },
  card: {
    background: "#fff",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};
