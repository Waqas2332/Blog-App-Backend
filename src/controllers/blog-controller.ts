import { type Request, Response } from "express";
import Blog, { BlogSchema } from "models/blog-model.js";
import User from "models/user-model.js";
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
  const param = req.query;

  try {
    const blogs = await Blog.find().lean();
    for (const blog of blogs) {
      const author = await User.findById(blog.author).lean();

      if (author) {
        blog.author = author.firstName;
      } else {
        blog.author = "Unknown";
      }
    }

    if (param?.preference) {
      const userPreferences = await UserPreferences.findOne({ user: user });
      const { preferences } = userPreferences;

      const preferenceBlogs = blogs.filter((blog) =>
        preferences.includes(blog.category)
      );
      return res.status(200).json({
        message: "Data fetched",
        ok: true,
        blogs: preferenceBlogs,
        preferences: true,
        user,
      });
    }

    return res.status(200).json({
      message: "Data fetched",
      ok: true,
      blogs,
      preferences: false,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", ok: false });
  }
};
