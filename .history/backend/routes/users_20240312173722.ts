import express, { Router, Request, Response } from "express";
import db from "../db/drizzle";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findMany();

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
