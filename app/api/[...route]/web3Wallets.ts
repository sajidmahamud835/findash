import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { wallets } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";

const app = new Hono();

app
    .get(
        "/wallets",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select({
                    id: wallets.id,
                    walletAddress: wallets.walletAddress,
                })
                .from(wallets)
                .where(eq(wallets.userId, auth.userId));

            return c.json({ data });
        }
    )

    .post(
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
