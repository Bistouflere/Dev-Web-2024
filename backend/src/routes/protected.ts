import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { Request, Router } from "express";

const router: Router = express.Router();

// Use the strict middleware that raises an error when unauthenticated
router.get(
  "/",
  ClerkExpressRequireAuth({}),
  (req: RequireAuthProp<Request>, res) => {
    res.json(req.auth);
  },
);

export default router;
