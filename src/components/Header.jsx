import React, { useState } from "react";
import "./Header.css";

export default function Header({ taskCount, onAddColumn, onReset }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddColumn(trimmed);
    setTitle("");
    setShowForm(false);
  };

  return (
    <header className="board-header">
      <div className="board-header__left">
        <span className="board-header__eyebrow">Deskboard / Project Tracker</span>
        <h1 className="board-header__title">The Bench</h1>
      </div>

      <div className="board-header__right">
        <span className="board-header__count">
          {String(taskCount).padStart(3, "0")} tasks tracked
        </span>

        {showForm ? (
          <form className="board-header__form" onSubmit={submit}>
            <input
              autoFocus
              placeholder="New lane name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => !title && setShowForm(false)}
            />
            <button type="submit">Add</button>
          </form>
        ) : (
          <button className="board-header__btn" onClick={() => setShowForm(true)}>
            + Lane
          </button>
        )}

        <button className="board-header__btn board-header__btn--ghost" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  );
}
