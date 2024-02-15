import express from "express";

import { authenticateJWT } from "middlewares/jwt.js";
import {
  addBlog,
  fetchBlogs,
  fetchBlog,
  updateLikes,
} from "controllers/blog-controller.js";

const router = express.Router();

router.post("/add-blog", authenticateJWT, addBlog);
router.get("/fetch-blogs", authenticateJWT, fetchBlogs);
router.get("/fetch-blogs/:id", authenticateJWT, fetchBlog);
router.put("/fetch-blogs/:id/like", authenticateJWT, updateLikes);

export default router;
