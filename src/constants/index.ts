import { EventForm } from "@/types";
import { formatToday } from "@/utils";

export const EventFormDefault: EventForm = {
	name: "Custom event",
	date: formatToday.date,
	time: formatToday.time,
};
