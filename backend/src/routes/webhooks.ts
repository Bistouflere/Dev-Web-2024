import { query } from "../db/index";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import bodyParser from "body-parser";
import express, { Router } from "express";
import { Webhook } from "svix";

const router: Router = express.Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    const headers = req.headers;
    const payload = req.body;

    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", evt.data);

    if (eventType === "user.created") {
      try {
        const result = await query(
          `
          INSERT INTO users (id, first_name, last_name, username, email_address, image_url)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
          `,
          [
            evt.data.id,
            evt.data.first_name,
            evt.data.last_name,
            evt.data.username,
            evt.data.email_addresses[0].email_address,
            evt.data.image_url,
          ],
        );

        return res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error("Error executing query", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (eventType === "user.updated") {
      try {
        const result = await query(
          `
          UPDATE users
          SET id = $1, first_name = $2, last_name = $3, username = $4, email_address = $5, image_url = $6
          WHERE id = $1
          RETURNING *;
          `,
          [
            evt.data.id,
            evt.data.first_name,
            evt.data.last_name,
            evt.data.username,
            evt.data.email_addresses[0].email_address,
            evt.data.image_url,
          ],
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error("Error executing query", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (eventType === "user.deleted") {
      try {
        const result = await query(
          `
          DELETE FROM users
          WHERE id = $1
          RETURNING *;
          `,
          [evt.data.id],
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(204).send();
      } catch (error) {
        console.error("Error executing query", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  },
);

export default router;
