export type EventStatus = "doing" | "done";

export interface Event {
	name: string;
	datetime: string;
	status?: EventStatus;
}
