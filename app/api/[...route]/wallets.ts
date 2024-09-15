import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { wallets } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";

const app = new Hono();

// Define schema for wallet-related requests
const walletSchema = z.object({
    walletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

const bulkDeleteSchema = z.object({
    ids: z.array(z.string()),
});

const idSchema = z.object({
    id: z.string().optional(),
});

app
    .get(
        "/",
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

    .get(
        "/:id",
        clerkMiddleware(),
        zValidator("param", idSchema),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .select({
                    id: wallets.id,
                    walletAddress: wallets.walletAddress,
                })
                .from(wallets)
                .where(and(eq(wallets.userId, auth.userId), eq(wallets.id, id)));

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    )

    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", walletSchema),
        async (c) => {
            const auth = getAuth(c);
            const { walletAddress } = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const existingWallet = await db
                .select({
                    walletAddress: wallets.walletAddress,
                })
                .from(wallets)
                .where(
                    and(eq(wallets.walletAddress, walletAddress), eq(wallets.userId, auth.userId))
                );

            if (existingWallet.length > 0) {
                return c.json({ error: "Wallet already exists" }, 409);
            }

            const [data] = await db
                .insert(wallets)
                .values({
                    id: createId(),
                    userId: auth.userId,
                    walletAddress,
                })
                .returning();

            return c.json({ data }, 201);
        }
    )

    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator("json", bulkDeleteSchema),
        async (c) => {
            const auth = getAuth(c);
            const { ids } = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .delete(wallets)
                .where(and(eq(wallets.userId, auth.userId), inArray(wallets.id, ids)))
                .returning({ id: wallets.id });

            return c.json({ data });
        }
    )

    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator("param", idSchema),
        zValidator("json", walletSchema),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const { walletAddress } = c.req.valid("json");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .update(wallets)
                .set({ walletAddress })
                .where(and(eq(wallets.userId, auth.userId), eq(wallets.id, id)))
                .returning();

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    )

    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator("param", idSchema),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .delete(wallets)
                .where(and(eq(wallets.userId, auth.userId), eq(wallets.id, id)))
                .returning({ id: wallets.id });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    );

export default app;
