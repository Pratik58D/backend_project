import type{ Request, Response } from "express";
import User from "../models/user.model.js";
import type{ IUser } from "../types/user.types.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const data: IUser = req.body;

    const user = await User.create(data);
    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ message: "User creation failed", error: err });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().lean(); // lean() gives better TS inference
    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
