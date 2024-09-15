import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//accounts
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaid: text("play_id"),
  walletId: text("wallet_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);

//categories
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaid: text("play_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

//web3 wallet 
export const wallets = pgTable("wallets", {
  id: text("id").primaryKey(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletsRelations = relations(wallets, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertWalletSchema = createInsertSchema(wallets);

//transactions
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  })
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});