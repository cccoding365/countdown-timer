export interface MessageOption {
	el?: string;
	text: string;
	duration?: number;
}

type EventStatus = "done" | "doing" | "unknown";

export interface Event {
	id: number;
	name: string;
	date: string;
	time: string;
	status?: EventStatus;
	label?: string;
}

export interface EventForm {
	name: string;
	date: string;
	time: string;
	label?: string;
}

export interface CountdownBox {
	id: number;
	name: string;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
