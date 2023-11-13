import { EventForm, CountdownBox } from "@/types";
import { formatToday } from "@/utils";

export const EventFormDefault: EventForm = {
	name: "",
	date: formatToday.date,
	time: formatToday.time,
};

export const CountdownBoxDefault: CountdownBox = {
	id: 0,
	name: "",
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
};
