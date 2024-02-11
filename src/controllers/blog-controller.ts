import { type Request, Response } from "express";
import Blog, { BlogSchema } from "models/blog-model.js";
import UserPreferences from "models/user-preferences-model.js";

export const addBlog = async (req: Request, res: Response) => {
  const data: BlogSchema = req.body;
  try {
    const response = await Blog.create({ ...data, author: req.user.userId });
    res
      .status(201)
      .json({ message: "Post Created Successfully", response, ok: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", ok: false });
  }
};

export const fetchBlogs = async (req: Request, res: Response) => {
  const user = req.user.userId;
  try {
    const userPreferences = await UserPreferences.findOne({ user: user });
    const { preferences } = userPreferences;
    const blogs = await Blog.find();

    const preferenceBlogs = blogs.filter((blog) =>
      preferences.includes(blog.category)
    );
    res.send(preferenceBlogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", ok: false });
  }
};
