import express from "express";

import { authenticateJWT } from "middlewares/jwt.js";
import { addBlog } from "controllers/blog-controller.js";

const router = express.Router();

router.post("/add-blog", authenticateJWT, addBlog);

export default router;
