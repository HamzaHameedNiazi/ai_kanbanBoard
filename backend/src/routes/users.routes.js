import express from "express";
import requireAuth from "../middleware/auth.js";
import seachUsers from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search",requireAuth,seachUsers);

export default router;