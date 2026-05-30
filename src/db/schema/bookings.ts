import { pgTable, serial, varchar, integer, date, text, timestamp, foreignKey, unique, numeric } from "drizzle-orm/pg-core";
import { rooms } from "./rooms";

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