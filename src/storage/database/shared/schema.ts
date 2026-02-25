import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const links = pgTable(
	"links",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 255 }).notNull(),
		url: varchar("url", { length: 500 }).notNull(),
		category: varchar("category", { length: 50 }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		// 可根据需要添加索引，例如按分类索引
	]
);

// 使用 createSchemaFactory 配置 date coercion（处理前端 string → Date 转换）
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
	coerce: { date: true },
});

// Zod schemas for validation
export const insertLinkSchema = createCoercedInsertSchema(links).pick({
	name: true,
	url: true,
	category: true,
});

// TypeScript types
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
