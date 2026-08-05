import React from "react";
import Column from "./Column";

export default function Board({
  columns,
  tasks,
  onAddTask,
  onDeleteTask,
  onMoveTask,
  onDeleteColumn,
}) {
  return (
    <div className="board-scroll">
      <div className="board-row">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.columnId === col.id)}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onDeleteColumn={onDeleteColumn}
          />
        ))}
      </div>
    </div>
  );
}
