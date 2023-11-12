export interface MessageOption {
	el?: string;
	text: string;
	duration?: number;
}

export interface Event {
	id: number;
	name: string;
	date: string;
	time: string;
}

export interface EventForm {
	name: string;
	date: string;
	time: string;
}

export interface CountdownBox {
	id: number;
	name: string;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
