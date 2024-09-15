import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import summary from "./summary";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import wallets from "./wallets";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal server error" }, 500);
});

const routes = app
  .route("/summary", summary)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/wallets", wallets);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
