import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
  id: integer('id').primaryKey(),
  name: text('name'),
});
