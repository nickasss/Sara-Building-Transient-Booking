import { relations } from "drizzle-orm/relations";
import { rooms, bookings, ledgerTransactions } from "./schema";

export const bookingsRelations = relations(bookings, ({one, many}) => ({
	room: one(rooms, {
		fields: [bookings.roomId],
		references: [rooms.id]
	}),
	ledgerTransactions: many(ledgerTransactions),
}));

export const roomsRelations = relations(rooms, ({many}) => ({
	bookings: many(bookings),
}));

export const ledgerTransactionsRelations = relations(ledgerTransactions, ({one}) => ({
	booking: one(bookings, {
		fields: [ledgerTransactions.bookingId],
		references: [bookings.id]
	}),
}));