// Small fetch wrapper that talks to the Deskboard API and attaches the JWT.
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "deskboard.token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked – user will just have to log in again */
  }
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection.");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me"),

  getBoard: () => request("/board"),
  addLane: (title) => request("/lanes", { method: "POST", body: { title } }),
  deleteLane: (id) => request(`/lanes/${id}`, { method: "DELETE" }),
  addCard: (columnId, title, priority) =>
    request("/cards", { method: "POST", body: { columnId, title, priority } }),
  moveCard: (id, columnId, index) =>
    request(`/cards/${id}/move`, { method: "PUT", body: { columnId, index } }),
  deleteCard: (id) => request(`/cards/${id}`, { method: "DELETE" }),
};
