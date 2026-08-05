import React, { useEffect, useState, useCallback } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import "./App.css";

const STORAGE_KEY = "deskboard.v1";

const seedData = {
  columns: [
    { id: "col-todo", title: "To Do", accent: "var(--accent-todo)" },
    { id: "col-progress", title: "In Progress", accent: "var(--accent-progress)" },
    { id: "col-done", title: "Done", accent: "var(--accent-done)" },
  ],
  tasks: [
    {
      id: "task-1",
      columnId: "col-todo",
      title: "Wireframe the product detail page",
      priority: "medium",
      createdAt: Date.now(),
    },
    {
      id: "task-2",
      columnId: "col-todo",
      title: "Set up Razorpay test credentials",
      priority: "high",
      createdAt: Date.now(),
    },
    {
      id: "task-3",
      columnId: "col-progress",
      title: "Build cart drawer component",
      priority: "high",
      createdAt: Date.now(),
    },
    {
      id: "task-4",
      columnId: "col-done",
      title: "Set up project repo + CRA scaffold",
      priority: "low",
      createdAt: Date.now(),
    },
  ],
  nextTaskNum: 5,
};

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read saved board, starting fresh.", e);
  }
  return seedData;
}

export default function App() {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save board.", e);
    }
  }, [state]);

  const addTask = useCallback((columnId, title, priority) => {
    setState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: `task-${prev.nextTaskNum}`,
          columnId,
          title,
          priority,
          createdAt: Date.now(),
        },
      ],
      nextTaskNum: prev.nextTaskNum + 1,
    }));
  }, []);

  const deleteTask = useCallback((taskId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  }, []);

  const moveTask = useCallback((taskId, targetColumnId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId: targetColumnId } : t
      ),
    }));
  }, []);

  const addColumn = useCallback((title) => {
    setState((prev) => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          id: `col-${Date.now()}`,
          title,
          accent: "var(--accent-todo)",
        },
      ],
    }));
  }, []);

  const deleteColumn = useCallback((columnId) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.id !== columnId),
      tasks: prev.tasks.filter((t) => t.columnId !== columnId),
    }));
  }, []);

  const resetBoard = useCallback(() => {
    if (window.confirm("Reset board to the sample data? This clears your changes.")) {
      setState(seedData);
    }
  }, []);

  return (
    <div className="app-shell">
      <Header
        taskCount={state.tasks.length}
        onAddColumn={addColumn}
        onReset={resetBoard}
      />
      <Board
        columns={state.columns}
        tasks={state.tasks}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
        onMoveTask={moveTask}
        onDeleteColumn={deleteColumn}
      />
    </div>
  );
}
