export enum DropType {
	FreeRsvp = 0,
	Paid = 1,
}

export enum DropStatus {
	Draft = 0,
	Published = 1,
	Cancelled = 2,
	Past = 3,
}

export interface DropOutput {
	id: string;
	title: string;
	summary: string | null;
	descriptionHtml: string | null;
	tags: string[];
	eventDate: string;
	endDate: string | null;
	startTime: string | null;
	endTime: string | null;
	timezone: string | null;
	venueName: string | null;
	location: string | null;
	flyerImagePath: string | null;
	accentColor: string | null;
	titleFont: string | null;
	type: DropType;
	status: DropStatus;
	hasCapacityLimit: boolean;
	capacity: number | null;
	ticketName: string | null;
	lineupGuests: string | null;
	youtubeLink: string | null;
	showOnExplore: boolean;
	passwordProtected: boolean;
	password: string | null;
	showGuestCount: boolean;
	currentRsvps: number;
	isFull: boolean;
	restaurantId: string;
	restaurantName: string | null;
	restaurantLogoPath: string | null;
	restaurantImage: string | null;
	partnerRestaurantIds: string[];
	userRsvpId: string | null;
	createdAt: string;
}

export interface DropRsvpOutput {
	id: string;
	userId: string;
	fullName: string | null;
	email: string | null;
	phone: string | null;
	checkedIn: boolean;
	checkedInAt: string | null;
	createdAt: string;
}

export interface AppCreateRsvpDto {
	userId: string;
	password?: string;
}
