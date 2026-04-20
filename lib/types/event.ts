export type EventStatus = "published" | "draft" | "ended";
export type RsvpStatus = "confirmed" | "pending";

export interface IEventRestaurant {
	id: string;
	name: string;
	image: string;
}

export interface IEventAttendee {
	id: string;
	name: string;
	avatar: string;
}

export interface IEvent {
	id: string;
	title: string;
	shortSummary: string;
	description: string;
	coverImage: string;
	accentColor: string;
	startDate: string;
	endDate: string;
	venueName: string;
	address: string;
	restaurant: IEventRestaurant;
	tags: string[];
	capacity: number | null;
	rsvpCount: number;
	requiresApproval: boolean;
	status: EventStatus;
	userRsvp: RsvpStatus | null;
	attendees: IEventAttendee[];
	attendeeCount: number;
	price: number | null;
	organizer: string;
	userRsvpId: string | null;
	passwordProtected: boolean;
}

export interface ICategory {
	name: string;
	image: string;
	color: string;
}
