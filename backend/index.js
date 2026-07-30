import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import cors from "cors";

import job from "./src/services/cron.js";
import initSocket from "./src/socket/index.js";
import apiRoutes from "./src/routes/index.js";
import {
    errorHandler,
    notFoundHandler,
} from "./src/middleware/errorHandler.js";

const app = express();

// -------------------------
// Middleware
// -------------------------

app.use(
    cors({
        origin: [
            "http://localhost:5173", // Local frontend
            process.env.CLIENT_URL,  // Render frontend
        ].filter(Boolean),
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }));

// -------------------------
// API Routes
// -------------------------

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "AI Kanban Board API",
    });
});

app.use("/api", apiRoutes);

// -------------------------
// Error Handlers
// -------------------------

app.use(notFoundHandler);
app.use(errorHandler);

// -------------------------
// HTTP + Socket.IO
// -------------------------

const server = http.createServer(app);

initSocket(server);

// -------------------------
// Start Server
// -------------------------

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    job.start();
});

export { app };
