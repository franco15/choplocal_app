import { DropOutput, DropPaymentStatus, DropStatus } from "@/lib/types/drop";
import { EventStatus, IEvent } from "@/lib/types/event";

const combineDateAndTime = (dateIso: string, time: string | null): string => {
	if (!time) return dateIso;
	const datePart = dateIso.split("T")[0];
	const timePart = time.length >= 8 ? time.substring(0, 8) : `${time}:00`;
	return `${datePart}T${timePart}`;
};

const PAYMENT_STATUS_BY_NAME: Record<string, DropPaymentStatus> = {
	None: DropPaymentStatus.None,
	Pending: DropPaymentStatus.Pending,
	Paid: DropPaymentStatus.Paid,
	Failed: DropPaymentStatus.Failed,
	Refunded: DropPaymentStatus.Refunded,
};

const normalizePaymentStatus = (
	raw: number | string | null | undefined,
): DropPaymentStatus => {
	if (raw == null) return DropPaymentStatus.None;
	if (typeof raw === "number") return raw as DropPaymentStatus;
	return PAYMENT_STATUS_BY_NAME[raw] ?? DropPaymentStatus.None;
};

const mapStatus = (status: DropStatus): EventStatus => {
	switch (status) {
		case DropStatus.Published:
			return "published";
		case DropStatus.Draft:
			return "draft";
		case DropStatus.Cancelled:
		case DropStatus.Past:
			return "ended";
		default:
			return "draft";
	}
};

export const mapDropToEvent = (drop: DropOutput): IEvent => {
	const startDate = combineDateAndTime(drop.eventDate, drop.startTime);
	const endDate = drop.endDate
		? combineDateAndTime(drop.endDate, drop.endTime)
		: combineDateAndTime(drop.eventDate, drop.endTime);

	return {
		id: drop.id,
		title: drop.title,
		shortSummary: drop.summary ?? "",
		description: drop.descriptionHtml ?? "",
		coverImage: drop.flyerImagePath ?? "",
		accentColor: drop.accentColor ?? "#1A1A1A",
		startDate,
		endDate,
		venueName: drop.venueName ?? "",
		address: drop.location ?? "",
		restaurant: {
			id: drop.restaurantId,
			name: drop.restaurantName ?? "",
			image: drop.restaurantImage ?? drop.restaurantLogoPath ?? "",
		},
		tags: drop.tags ?? [],
		capacity: drop.hasCapacityLimit ? drop.capacity : null,
		rsvpCount: drop.currentRsvps,
		attendeeCount: drop.currentRsvps,
		requiresApproval: false,
		status: mapStatus(drop.status),
		userRsvp: drop.userRsvpId ? "confirmed" : null,
		userRsvpId: drop.userRsvpId,
		attendees: [],
		price: drop.price ?? null,
		paymentStatus: normalizePaymentStatus(drop.userRsvpPaymentStatus),
		organizer: drop.restaurantName ?? "",
		passwordProtected: drop.passwordProtected,
	};
};
