# Deskboard: Full-Stack Kanban Board

A Trello-style Kanban board with user accounts. Drag cards between lanes, and everything is saved to a database, so your board is there when you log back in.

**Live demo:** https://surjeet124.github.io/kanban-board-trello-clone/
**Backend repo:** https://github.com/Surjeet124/deskboard-api

> The API runs on a free Render instance, so the first request after a period of inactivity can take 30-50 seconds.

## Features
- Sign up / log in (JWT authentication, passwords hashed with bcrypt)
- Create and delete lanes; add and delete cards with priority tags
- Drag and drop cards between lanes (native HTML5 Drag and Drop API, no library)
- Each user sees only their own board
- Optimistic UI: delete and move update instantly and roll back if the server fails

## Tech Stack
- **Frontend:** React.js, CSS, deployed on GitHub Pages
- **Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JWT, bcrypt, Helmet, CORS, rate limiting
- **Hosting:** Render (API), MongoDB Atlas (database)

## How it works
- State lives in `App.js` and flows down to Board, Column and TaskCard via props.
- `src/api.js` is a small fetch wrapper that attaches the JWT to every request.
- The backend stores each card's `position` per lane, so order survives refresh.
- Every database query is filtered by the logged-in user, so users cannot see each other's data.

## Run locally
```bash
npm install
# create .env with: REACT_APP_API_URL=http://localhost:5000/api
npm start
```
The backend setup is in the backend repo's README.

## Author
Surjeet