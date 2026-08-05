import React from "react";
import "./TaskCard.css";

const PRIORITY_LABEL = {
  low: "Low",
  medium: "Med",
  high: "High",
};

function ticketNumber(id) {
  const num = id.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `#${num}`;
}

export default function TaskCard({ task, onDelete }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/task-id", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <article
      className={`task-card task-card--${task.priority}`}
      draggable
      onDragStart={handleDragStart}
    >
      <header className="task-card__meta">
        <span className="task-card__id">{ticketNumber(task.id)}</span>
        <span className={`task-card__priority task-card__priority--${task.priority}`}>
          {PRIORITY_LABEL[task.priority] || "Med"}
        </span>
      </header>

      <p className="task-card__title">{task.title}</p>

      <footer className="task-card__footer">
        <span className="task-card__date">
          {new Date(task.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
        <button className="task-card__delete" onClick={() => onDelete(task.id)}>
          Remove
        </button>
      </footer>
    </article>
  );
}
