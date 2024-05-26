import { query } from "../db/index";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sql = "SELECT * FROM games;";

    const result = await query(sql);

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
