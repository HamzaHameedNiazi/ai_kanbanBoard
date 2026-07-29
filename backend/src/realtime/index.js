import db from "../config/db.js";

// Extract query from the default exported db object
const { query } = db;

let io = null;

// Named export
export const setIo = (instance) => {
  io = instance;
};

// Named export
export const boardRoom = (boardId) => `board:${boardId}`;

// Named export
export const emitToBoard = (boardId, event, payload) => {
  if (io) {
    io.to(boardRoom(boardId)).emit(event, payload);
  }
};

// Named export
export const logActivity = async ({
  boardId,
  userId,
  action,
  message,
  metadata,
}) => {
  const { rows } = await query(
    `INSERT INTO activities (board_id, user_id, action, message, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, board_id, user_id, action, message, metadata, created_at`,
    [
      boardId,
      userId || null,
      action,
      message,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );

  const activity = rows[0];
  emitToBoard(boardId, "activity:new", activity);
  return activity;
};

// Optional: keep the default export for compatibility
export default {
  setIo,
  emitToBoard,
  logActivity,
  boardRoom,
};