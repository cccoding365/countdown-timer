export type EventStatus = "doing" | "done";

export interface Event {
	name: string;
	datetime: string;
	status?: EventStatus;
}

export interface DatetimeGap {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
