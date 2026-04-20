import { DropOutput, DropStatus, DropType } from "@/lib/types/drop";
import { EventStatus, IEvent } from "@/lib/types/event";

const combineDateAndTime = (dateIso: string, time: string | null): string => {
	if (!time) return dateIso;
	const datePart = dateIso.split("T")[0];
	const timePart = time.length >= 8 ? time.substring(0, 8) : `${time}:00`;
	return `${datePart}T${timePart}`;
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
		price: drop.type === DropType.Paid ? 0 : null,
		organizer: drop.restaurantName ?? "",
		passwordProtected: drop.passwordProtected,
	};
};
