import { type Request, Response } from "express";
import Blog, { BlogSchema } from "models/blog-model.js";
import User from "models/user-model.js";
import UserPreferences from "models/user-preferences-model.js";
import mongoose from "mongoose";

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

    // showing blogs of the user which is logged in
    if (param?.user) {
      const userBlogs = blogs.filter(
        (blog) => blog.author.toString() === req.user.userId
      );

      for (const blog of userBlogs) {
        blog.author = "You";
      }

      return res.status(200).json({
        message: "Data fetched",
        ok: true,
        blogs: userBlogs,
        user,
      });
    }

    // filtering user's on blogs and showing all other blogs
    const filteredBlogs = blogs.filter(
      (blog) => blog.author.toString() !== user
    );

    for (const blog of blogs) {
      const authorId = new mongoose.Types.ObjectId(blog.author);
      const author = await User.findById(authorId).lean();
      // console.log(author);

      if (author) {
        blog.author = author.firstName;
      } else {
        blog.author = "Unknown";
      }
    }

    // showing blogs according to preference
    if (param?.preference) {
      const userPreferences = await UserPreferences.findOne({ user: user });
      const { preferences } = userPreferences;

      const preferenceBlogs = filteredBlogs.filter((blog) =>
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
      blogs: filteredBlogs,
      preferences: false,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", ok: false });
  }
};

export const fetchBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not Found", ok: false });
  }
  try {
    const blog = await Blog.findById(id).lean();
    const author = await User.findById(blog.author).lean();

    blog.author = author.firstName;

    res
      .status(200)
      .json({ message: "Data fetched successfully", blog, ok: true });
  } catch (error) {
    console.log(error);
  }
};
