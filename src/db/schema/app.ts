import { relations } from "drizzle-orm";
import { integer, pgTable, PgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";


const Timestamp = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    // The $onUpdate method is used to automatically update the "updatedAt" field to the current date/time
    // whenever the row is updated. It's commonly used for "last updated" timestamps.
    // Use $onUpdate when you want to track the last modification time of a row in your table.
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
}
export const departments = pgTable("department", {
    id: integer('id').primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255}).notNull(),
    code: varchar('code', { length: 10}).notNull().unique(),
    description: varchar('description', { length: 255}).notNull(),
    ...Timestamp,
})

export const subjects = pgTable("subject", {
    id: integer('id').primaryKey().notNull().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255}).notNull(),
    departmentId: integer('department_id').references(() => departments.id, { onDelete: "restrict"}),
    code: varchar('code', { length: 10}).notNull().unique(),
        description: varchar('description', { length: 255 }).notNull(),
        ...Timestamp,
    });

    export const departmentsRelations = relations(departments, ({many}) => ({
        subjects: many(subjects),
    }))
    export const subjectsRelations = relations(subjects, ({one, many}) => ({
        departments  : one(departments , {
            fields: [subjects.departmentId],
            references: [departments.id],
            relationName: "department_subject",
        })
    }))

    export type Department = typeof departments.$inferSelect;
    export type NewDepartment = typeof departments.$inferInsert;
    export type Subject = typeof subjects.$inferSelect;
    export type NewSubject = typeof subjects.$inferInsert;