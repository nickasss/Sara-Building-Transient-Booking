import { pgTable, serial, varchar, text, timestamp, numeric, integer, foreignKey, unique, date, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const auditLogs = pgTable("audit_logs", {
	id: serial().primaryKey().notNull(),
	entityType: varchar("entity_type").notNull(),
	entityId: varchar("entity_id").notNull(),
	action: varchar().notNull(),
	oldValue: text("old_value"),
	newValue: text("new_value"),
	performedBy: varchar("performed_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
	id: serial().primaryKey().notNull(),
	depositPercentage: numeric("deposit_percentage", { precision: 5, scale:  2 }).notNull(),
	depositDeadlineHours: integer("deposit_deadline_hours").notNull(),
	gracePeriodDays: integer("grace_period_days").notNull(),
	propertyName: varchar("property_name"),
	propertyAddress: varchar("property_address"),
	contactPhone: varchar("contact_phone"),
	currencySymbol: varchar("currency_symbol").default('$').notNull(),
	taxRate: numeric("tax_rate", { precision: 5, scale:  2 }).default('0').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
	id: serial().primaryKey().notNull(),
	bookingRef: varchar("booking_ref").notNull(),
	roomId: integer("room_id").notNull(),
	contactNumber: varchar("contact_number"),
	checkInDate: date("check_in_date").notNull(),
	checkOutDate: date("check_out_date").notNull(),
	occupantsCount: integer("occupants_count").notNull(),
	status: varchar().default('RESERVED').notNull(),
	paymentStatus: varchar("payment_status").default('CURRENT').notNull(),
	depositDeadline: timestamp("deposit_deadline", { withTimezone: true, mode: 'string' }).notNull(),
	finalDueDate: timestamp("final_due_date", { withTimezone: true, mode: 'string' }),
	depositPctSnapshot: numeric("deposit_pct_snapshot", { precision: 5, scale:  2 }).notNull(),
	cancellationReason: text("cancellation_reason"),
	cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "bookings_room_id_rooms_id_fk"
		}),
	unique("bookings_booking_ref_unique").on(table.bookingRef),
]);

export const rooms = pgTable("rooms", {
	id: serial().primaryKey().notNull(),
	roomNumber: varchar("room_number").notNull(),
	type: varchar().notNull(),
	capacity: integer().notNull(),
	basePrice: numeric("base_price", { precision: 19, scale:  4 }).notNull(),
	status: varchar().default('AVAILABLE').notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("rooms_room_number_unique").on(table.roomNumber),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	password: text().notNull(),
	role: varchar().default('STAFF').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const ledgerTransactions = pgTable("ledger_transactions", {
	id: serial().primaryKey().notNull(),
	bookingId: integer("booking_id").notNull(),
	type: varchar().notNull(),
	category: varchar().notNull(),
	amount: numeric({ precision: 19, scale:  4 }).notNull(),
	description: text(),
	paymentMethod: varchar("payment_method"),
	referenceNumber: varchar("reference_number"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "ledger_transactions_booking_id_bookings_id_fk"
		}),
]);
