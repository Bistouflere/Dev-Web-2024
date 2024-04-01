import { db } from "../db/index";
import { users } from "../db/schema";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import bodyParser from "body-parser";
import { eq } from "drizzle-orm";
import express, { Router } from "express";
import { Webhook } from "svix";

const router: Router = express.Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Grab the headers and body
    const headers = req.headers;
    const payload = req.body;

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Grab the ID and TYPE of the Webhook
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    // Console log the full payload to view
    console.log("Webhook body:", evt.data);

    if (eventType === "user.created") {
      await db.insert(users).values({
        clerk_id: evt.data.id,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
        username: evt.data.username!,
        email_address: evt.data.email_addresses[0].email_address,
        image_url: evt.data.image_url,
        created_at: new Date(evt.data.created_at),
        updated_at: new Date(evt.data.updated_at),
        last_sign_in_at: evt.data.last_sign_in_at
          ? new Date(evt.data.last_sign_in_at)
          : null,
      });
    } else if (eventType === "user.updated") {
      await db
        .update(users)
        .set({
          clerk_id: evt.data.id,
          first_name: evt.data.first_name,
          last_name: evt.data.last_name,
          username: evt.data.username!,
          email_address: evt.data.email_addresses[0].email_address,
          image_url: evt.data.image_url,
          created_at: new Date(evt.data.created_at),
          updated_at: new Date(evt.data.updated_at),
          last_sign_in_at: evt.data.last_sign_in_at
            ? new Date(evt.data.last_sign_in_at)
            : null,
        })
        .where(eq(users.clerk_id, evt.data.id));
    } else if (eventType === "user.deleted") {
      await db.delete(users).where(eq(users.clerk_id, evt.data.id!));
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  },
);

export default router;
