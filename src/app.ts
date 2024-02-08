import express from "express";

import authRoutes from "./routes/auth-routes.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || "5000";

app.listen(PORT, () => {
  mongoose
    .connect(
      "mongodb+srv://devwaqas232:devwaqas232@blog.leftka8.mongodb.net/blog"
    )
    .then(() => {
      console.log("Server is running at Port 5000");
    })
    .catch((error) => {
      console.log(error);
    });
});
