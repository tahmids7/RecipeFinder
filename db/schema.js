import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  recipeData: jsonb("recipe_data").notNull()
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertFavoriteSchema = createInsertSchema(favorites);
export const selectFavoriteSchema = createSelectSchema(favorites);
