import React, { useState } from "react";
import "./AuthForm.css";

export default function AuthForm({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isRegister) await onRegister(name, email, password);
      else await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit}>
        <h1 className="auth__title">Deskboard</h1>
        <p className="auth__sub">
          {isRegister ? "Create your account" : "Log in to your board"}
        </p>

        {isRegister && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="auth__error">{error}</p>}

        <button className="auth__submit" disabled={busy}>
          {busy ? "Please wait..." : isRegister ? "Sign up" : "Log in"}
        </button>

        <button
          type="button"
          className="auth__switch"
          onClick={() => {
            setMode(isRegister ? "login" : "register");
            setError("");
          }}
        >
          {isRegister ? "Already have an account? Log in" : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}
