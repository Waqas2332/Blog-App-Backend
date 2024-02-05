import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "models/user-model.js";
import { type UserSchema } from "models/user-model.js";
import { authenticateJWT, generateToken } from "middlewares/jwt.js";

export const register = async (req: Request, res: Response) => {
  const data: UserSchema = await req.body;
  try {
    const checkUser = await User.findOne({ email: data.email });
    if (checkUser) {
      return res
        .status(409)
        .json({ message: "User already exists", ok: false });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const { _id, email, password } = user;

    const token = generateToken({ _id, email, password });
    res
      .status(201)
      .json({ message: "User Created Successfully", ok: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", ok: false });
  }
};
