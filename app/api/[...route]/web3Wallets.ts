import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { wallets } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono();

app.post(
    "/wallets",
    clerkMiddleware(),
    zValidator("json", z.object({ walletAddress: z.string() })),
    async (c) => {
        const auth = getAuth(c);
        const { walletAddress } = c.req.valid("json");

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        await db.insert(wallets).values({
            id: createId(),
            userId: auth.userId,
            walletAddress,
        });

        return c.json({ message: "Wallet added successfully" }, 201);
    }
);

export default app;
