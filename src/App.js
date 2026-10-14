import React, { useEffect, useState, useCallback } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import { api, getToken, setToken } from "./api";
import "./App.css";

const EMPTY_BOARD = { columns: [], tasks: [] };

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(getToken()));
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [notice, setNotice] = useState("");

  const showError = useCallback((err) => {
    setNotice(err.message || "Something went wrong.");
    setTimeout(() => setNotice(""), 4000);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setBoard(EMPTY_BOARD);
  }, []);

  const loadBoard = useCallback(async () => {
    setLoadingBoard(true);
    try {
      setBoard(await api.getBoard());
    } catch (err) {
      if (err.status === 401) logout();
      else showError(err);
    } finally {
      setLoadingBoard(false);
    }
  }, [logout, showError]);

  // Restore the session if a token is already stored.
  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setCheckingSession(false));
  }, []);

  // Load the board whenever a user becomes available.
  useEffect(() => {
    if (user) loadBoard();
  }, [user, loadBoard]);

  /* ---------- auth ---------- */

  const handleAuth = async (promise) => {
    const { token, user } = await promise;
    setToken(token);
    setUser(user);
  };
  const login = (email, password) => handleAuth(api.login(email, password));
  const register = (name, email, password) =>
    handleAuth(api.register(name, email, password));

  /* ---------- board actions ---------- */

  const addTask = useCallback(
    async (columnId, title, priority) => {
      try {
        const task = await api.addCard(columnId, title, priority);
        setBoard((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
      } catch (err) {
        showError(err);
      }
    },
    [showError]
  );

  // Optimistic: update the UI first, undo if the server rejects it.
  const deleteTask = useCallback(
    async (taskId) => {
      let snapshot;
      setBoard((prev) => {
        snapshot = prev;
        return { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) };
      });
      try {
        await api.deleteCard(taskId);
      } catch (err) {
        setBoard(snapshot);
        showError(err);
      }
    },
    [showError]
  );

  const moveTask = useCallback(
    async (taskId, targetColumnId) => {
      let snapshot;
      let alreadyThere = false;
      setBoard((prev) => {
        snapshot = prev;
        const moving = prev.tasks.find((t) => t.id === taskId);
        if (!moving || moving.columnId === targetColumnId) {
          alreadyThere = true;
          return prev;
        }
        // Move the card to the end of the target lane, same as the server does.
        const rest = prev.tasks.filter((t) => t.id !== taskId);
        return { ...prev, tasks: [...rest, { ...moving, columnId: targetColumnId }] };
      });
      if (alreadyThere) return;
      try {
        await api.moveCard(taskId, targetColumnId);
      } catch (err) {
        setBoard(snapshot);
        showError(err);
      }
    },
    [showError]
  );

  const addColumn = useCallback(
    async (title) => {
      try {
        const column = await api.addLane(title);
        setBoard((prev) => ({ ...prev, columns: [...prev.columns, column] }));
      } catch (err) {
        showError(err);
      }
    },
    [showError]
  );

  const deleteColumn = useCallback(
    async (columnId) => {
      let snapshot;
      setBoard((prev) => {
        snapshot = prev;
        return {
          columns: prev.columns.filter((c) => c.id !== columnId),
          tasks: prev.tasks.filter((t) => t.columnId !== columnId),
        };
      });
      try {
        await api.deleteLane(columnId);
      } catch (err) {
        setBoard(snapshot);
        showError(err);
      }
    },
    [showError]
  );

  // Reset = delete every lane; the server re-creates the starter board on next load.
  const resetBoard = useCallback(async () => {
    if (!window.confirm("Reset your board to the starter lanes? This deletes all cards.")) {
      return;
    }
    try {
      await Promise.all(board.columns.map((c) => api.deleteLane(c.id)));
      await loadBoard();
    } catch (err) {
      showError(err);
    }
  }, [board.columns, loadBoard, showError]);

  /* ---------- render ---------- */

  if (checkingSession) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!user) return <AuthForm onLogin={login} onRegister={register} />;

  return (
    <div className="app-shell">
      <Header
        taskCount={board.tasks.length}
        onAddColumn={addColumn}
        onReset={resetBoard}
      />
      <div className="app-userbar">
        <span>Hi, {user.name}</span>
        <button onClick={logout}>Log out</button>
      </div>
      {notice && <div className="app-notice">{notice}</div>}
      {loadingBoard ? (
        <p style={{ padding: 24 }}>Loading your board...</p>
      ) : (
        <Board
          columns={board.columns}
          tasks={board.tasks}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
          onDeleteColumn={deleteColumn}
        />
      )}
    </div>
  );
}
