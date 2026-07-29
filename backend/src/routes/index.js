import express from 'express';
import authRoutes from './auth.routes.js';
import boardRoutes from './board.routes.js';
import userRoutes from './users.routes.js';

const router = express.Router();

router.get("/health", (_req,res)=> res.json({status: "ok"}))

router.use("/auth",authRoutes);
router.use("/boards",boardRoutes);
router.use("/users",userRoutes);

export default router;