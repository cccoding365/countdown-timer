import { EventForm } from "@/types";
import { formatToday } from "@/utils";

export const EventFormDefault: EventForm = {
	name: `Custom Event#${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
	date: formatToday.date,
	time: formatToday.time,
};
