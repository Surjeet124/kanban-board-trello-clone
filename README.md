# Deskboard — Kanban Board (Trello Clone)

A React kanban board: drag-and-drop cards across lanes, add/delete cards and lanes,
priority tags, and everything persisted to `localStorage`.

## Run it

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## What's inside

- `src/App.js` — top-level state (columns + tasks), localStorage load/save, all
  add/delete/move handlers passed down as props.
- `src/components/Board.jsx` — lays out the columns.
- `src/components/Column.jsx` — a single lane: drop target (native HTML5 DnD),
  add-card form, delete-lane button.
- `src/components/TaskCard.jsx` — a single draggable card with priority tag,
  id stub, and delete.
- `src/components/Header.jsx` — title bar, live task counter, "+ Lane" control.

