import dotenv from "dotenv";
dotenv.config();

import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import job from "./src/services/cron.js";

import express from "express";
import cors from "cors";

import initSocket from "./src/socket/index.js";
import apiRoutes from "./src/routes/index.js";
import {
    errorHandler,
    notFoundHandler,
} from "./src/middleware/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        })
    );
}

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
// Serve React App (Production)
// -------------------------

if (process.env.NODE_ENV === "production") {
    const publicPath = path.join(__dirname, "public");

    app.use(express.static(publicPath));

    app.get("*", (req, res, next) => {
        // Let Express handle API routes normally
        if (req.path.startsWith("/api")) {
            return next();
        }

        res.sendFile(path.join(publicPath, "index.html"));
    });
}

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