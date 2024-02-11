import mongoose, { InferSchemaType } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Health",
        "Travel",
        "Food",
        "Fashion",
        "Fitness",
        "Books",
        "Movies",
        "Music",
        "Sports",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export type BlogSchema = InferSchemaType<typeof blogSchema>;

const Blog = mongoose.model("Blogs", blogSchema);
export default Blog;
