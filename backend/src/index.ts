import { errorHandler } from "./middleware/errorMiddleware";
import protectedRouter from "./routes/protected";
import teamsRouter from "./routes/teams";
import tournamentsRouter from "./routes/tournaments";
import usersRouter from "./routes/users";
import webhooksRouter from "./routes/webhooks";
import swaggerDocument from "./swagger.json";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import express, { Application, NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

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
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/webhooks", webhooksRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/tournaments", tournamentsRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
