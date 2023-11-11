import { Event, EventStatus, DatetimeGap } from "@/types";

export default class CountdownEvent {
	name: string;
	datetime: string;
	status: EventStatus;
	timer: any;
	datetimeGap: DatetimeGap;
	constructor(event: Event) {
		this.name = event.name;
		this.datetime = event.datetime;
		this.status = event.status || "doing";
		this.datetimeGap = { days: 0, hours: 0, minutes: 0, seconds: 0 };
		this.timer = setInterval(() => {
			this.datetimeGap = this.getDatetimeGap(
				new Date(event.datetime).getTime(),
				Date.now(),
			);
		}, 1000);
	}

	done() {
		this.status = "done";
	}

	getDatetimeGap(timestamp1: number, timestamp2: number): DatetimeGap {
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
