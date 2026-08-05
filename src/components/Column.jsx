import React, { useState } from "react";
import TaskCard from "./TaskCard";
import "./Column.css";

export default function Column({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onMoveTask,
  onDeleteColumn,
}) {
  const [isOver, setIsOver] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData("text/task-id");
    if (taskId) onMoveTask(taskId, column.id);
  };

  const submitTask = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddTask(column.id, trimmed, priority);
    setTitle("");
    setPriority("medium");
    setShowForm(false);
  };

  return (
    <section
      className={`column${isOver ? " column--over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="column__head" style={{ "--col-accent": column.accent }}>
        <div className="column__head-label">
          <span className="column__dot" />
          <h2>{column.title}</h2>
        </div>
        <div className="column__head-right">
          <span className="column__count">{tasks.length}</span>
          <button
            className="column__delete"
            title="Delete lane"
            onClick={() => onDeleteColumn(column.id)}
          >
            &times;
          </button>
        </div>
      </div>

      <div className="column__body">
        {tasks.length === 0 && !showForm && (
          <p className="column__empty">No cards here yet.</p>
        )}
        {tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {showForm ? (
        <form className="column__form" onSubmit={submitTask}>
          <textarea
            autoFocus
            placeholder="Describe the task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
          />
          <div className="column__form-row">
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="column__form-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="column__form-add">
                Add card
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button className="column__add-trigger" onClick={() => setShowForm(true)}>
          + Add a card
        </button>
      )}
    </section>
  );
}
