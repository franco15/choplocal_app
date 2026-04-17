import { ALL_CATEGORIES, EVENT_TAGS, mockEvents } from "../mock/eventsMock";
import { ICategory, IEvent, IEventRestaurant, RsvpStatus } from "../types/event";

// In-memory copy so mutations (RSVP) persist during the session
let events = mockEvents.map((e) => ({ ...e }));

const delay = <T>(value: T): Promise<T> =>
	new Promise((resolve) => setTimeout(() => resolve(value), 400));

/** Published events sorted by startDate ascending */
export const getEvents = (): Promise<IEvent[]> => {
	const result = events
		.filter((e) => e.status === "published")
		.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		);
	return delay(result);
};

/** Published events filtered by tag */
export const getEventsByTag = (tag: string): Promise<IEvent[]> => {
	const result = events
		.filter((e) => e.status === "published" && e.tags.includes(tag))
		.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		);
	return delay(result);
};

/** The N closest upcoming published events (startDate >= now) */
export const getUpcomingEvents = (limit: number): Promise<IEvent[]> => {
	const now = new Date().getTime();
	const result = events
		.filter(
			(e) =>
				e.status === "published" && new Date(e.startDate).getTime() >= now,
		)
		.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		)
		.slice(0, limit);
	return delay(result);
};

/** Trending events — most RSVPs among published */
export const getTrendingEvents = (limit: number): Promise<IEvent[]> => {
	const result = events
		.filter((e) => e.status === "published")
		.sort((a, b) => b.rsvpCount - a.rsvpCount)
		.slice(0, limit);
	return delay(result);
};

/** Single event by id (any status) */
export const getEventById = (id: string): Promise<IEvent> => {
	const event = events.find((e) => e.id === id);
	if (!event) return Promise.reject(new Error("Event not found"));
	return delay({ ...event });
};

/** RSVP to an event. Returns confirmed or pending based on requiresApproval */
export const rsvpToEvent = (
	eventId: string,
): Promise<{ status: RsvpStatus }> => {
	const event = events.find((e) => e.id === eventId);
	if (!event) return Promise.reject(new Error("Event not found"));

	const status: RsvpStatus = event.requiresApproval ? "pending" : "confirmed";
	event.userRsvp = status;
	event.rsvpCount += 1;
	event.attendeeCount += 1;

	return delay({ status });
};

/** Cancel an existing RSVP */
export const cancelRsvp = (eventId: string): Promise<void> => {
	const event = events.find((e) => e.id === eventId);
	if (!event) return Promise.reject(new Error("Event not found"));

	event.userRsvp = null;
	event.rsvpCount = Math.max(0, event.rsvpCount - 1);
	event.attendeeCount = Math.max(0, event.attendeeCount - 1);

	return delay(undefined);
};

/** Available event tags */
export const getEventTags = (): Promise<string[]> => {
	return delay([...EVENT_TAGS]);
};

/** All categories with images and colors */
export const getAllCategories = (): Promise<ICategory[]> => {
	return delay([...ALL_CATEGORIES]);
};

/** Published events for a given restaurant (matches by ID or name) */
export const getEventsByRestaurant = (
	restaurantId: string,
	restaurantName?: string,
): Promise<IEvent[]> => {
	const nameLower = restaurantName?.toLowerCase() ?? "";
	const result = events
		.filter(
			(e) =>
				e.status === "published" &&
				(e.restaurant.id === restaurantId ||
					(nameLower && e.restaurant.name.toLowerCase() === nameLower)),
		)
		.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		);
	return delay(result);
};

/** Upcoming events the user has RSVP'd to (confirmed or pending) */
export const getMyUpcomingEvents = (): Promise<IEvent[]> => {
	const now = new Date().getTime();
	const result = events
		.filter(
			(e) =>
				e.userRsvp !== null &&
				e.status === "published" &&
				new Date(e.startDate).getTime() >= now,
		)
		.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		);
	return delay(result);
};

/** Unique restaurants that have upcoming published events */
export const getRestaurantsWithEvents = (): Promise<
	(IEventRestaurant & { eventCount: number })[]
> => {
	const map = new Map<string, { restaurant: IEventRestaurant; count: number }>();
	for (const e of events) {
		if (e.status !== "published") continue;
		const existing = map.get(e.restaurant.id);
		if (existing) {
			existing.count += 1;
		} else {
			map.set(e.restaurant.id, { restaurant: e.restaurant, count: 1 });
		}
	}
	const result = Array.from(map.values())
		.filter((r) => r.count > 0)
		.sort((a, b) => b.count - a.count)
		.map((r) => ({ ...r.restaurant, eventCount: r.count }));
	return delay(result);
};

/** Event count per tag (published only) */
export const getEventCountByTag = (): Promise<Record<string, number>> => {
	const counts: Record<string, number> = {};
	for (const tag of EVENT_TAGS) {
		counts[tag] = events.filter(
			(e) => e.status === "published" && e.tags.includes(tag),
		).length;
	}
	return delay(counts);
};
