import { type Request, Response } from "express";
import Blog, { BlogSchema } from "models/blog-model.js";

export const addBlog = async (req: Request, res: Response) => {
  const data: BlogSchema = req.body;
  try {
    const response = await Blog.create({ ...data, author: req.user.userId });
    res
      .status(201)
      .json({ message: "Post Created Successfully", response, ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", ok: false });
  }
};
