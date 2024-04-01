import * as schema from "./schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const db = drizzle(client, { schema: schema });
