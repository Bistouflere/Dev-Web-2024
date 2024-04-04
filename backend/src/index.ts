import protectedRouter from "./routes/protected";
import teamsRouter from "./routes/teams";
import tournamentsRouter from "./routes/tournaments";
import usersRouter from "./routes/users";
import webhooksRouter from "./routes/webhooks";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import express, { Application, NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const port = process.env.PORT || 3000;
const app: Application = express();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(limiter);
app.use("/api/webhooks", webhooksRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/tournaments", tournamentsRouter);
app.use("/api/users", usersRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
