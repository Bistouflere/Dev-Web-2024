import protectedRouter from "./routes/protected";
import testRouter from "./routes/test";
import usersRouter from "./routes/users";
import webhooksRouter from "./routes/webhooks";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import express, { Application, NextFunction, Request, Response } from "express";

const port = process.env.PORT || 3000;
const app: Application = express();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use("/api/test", testRouter);
app.use("/api/webhooks", webhooksRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/users", usersRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
