import { Event, EventStatus } from "@/types";

export default class CountdownEvent {
	name: string;
	datetime: string;
	status: EventStatus;
	constructor(event: Event) {
		this.name = event.name;
		this.datetime = event.datetime;
		this.status = event.status || "doing";
	}

	done() {
		this.status = "done";
		console.log(this);
	}

	getDatetimeGap(timestamp1: number, timestamp2: number) {
		const gap = Math.abs(timestamp1 - timestamp2) / 1000;

		const days = Math.floor(gap / 86400);
		const hours = Math.floor((gap % 86400) / 3600);
		const minutes = Math.floor((gap % 3600) / 60);
		const seconds = Math.floor(gap % 60);

		return {
			days,
			hours,
			minutes,
			seconds,
		};
	}
}
