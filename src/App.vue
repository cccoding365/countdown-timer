<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { getDatetimeGap, formatToday } from "@/utils";
import { Event, EventForm, TipsOption } from "@/types";
import { reactive, ref } from "vue";

const eventCountdown = ref({
	name: "",
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
});

let timer: any;

const eventContainer = ref<Event[]>([
	{ name: "Write event name", date: "1998-11-01", time: "10:25" },
	{
		name: "Set date time",
		date: "2021-07-04",
		time: "12:00",
	},
	{
		name: "Click the Start button",
		date: "2026-03-19",
		time: "20:00",
	},
]);

const tipsHandler = ({ text, duration = 2000 }: TipsOption) => {
	tips.value = text;
	setTimeout(() => {
		tips.value = "";
	}, duration);
};

const handleEventCreate = () => {
	const { name, date, time } = eventForm;

	if (!name) {
		return tipsHandler({ text: "The field 'event name' is required!" });
	}
	if (!date) {
		return tipsHandler({ text: "The field 'date' is required!" });
	}
	if (!time) {
		return tipsHandler({ text: "The field 'time' is required!" });
	}

	const targetDatetime = new Date(`${date} ${time}`).getTime();
	const now = Date.now();

	if (targetDatetime <= now) {
		return tipsHandler({
			text: "The target time must be later than the current time!",
		});
	}

	const eventObj = { name, date, time };
	eventContainer.value.unshift(eventObj);

	handleEventStart(eventObj);
};

const handleEventStart = (event: Event) => {
	const { name, date, time } = event;

	const targetDatetime = new Date(`${date} ${time}`).getTime();

	timer && clearInterval(timer);
	const now = Date.now();
	eventCountdown.value = { name, ...getDatetimeGap(targetDatetime, now) };

	timer = setInterval(() => {
		const now = Date.now();
		eventCountdown.value = { name, ...getDatetimeGap(targetDatetime, now) };
		if (targetDatetime - now <= 0) {
			clearInterval(timer);
			eventCountdown.value.name += " Finished";
		}
	}, 1000);
};

const tips = ref("");

const eventForm = reactive<EventForm>({
	name: "",
	date: formatToday.date,
	time: formatToday.time,
});

const numberDegit = (num: number) => {
	return String(num).padStart(2, "0").length * 50 + "px";
};

const handleClose = () => {
	eventCountdown.value.name = "";
	clearInterval(timer);
};
</script>

<template>
	<Logo />

	<div class="tips">{{ tips }}</div>

	<div class="event-container">
		<div
			v-for="event in eventContainer"
			class="event-card"
			@click="handleEventStart(event)"
		>
			<div class="name">
				{{ event.name }}
			</div>
			<div class="datetime">
				<span class="date">{{ event.date }}</span>
				<span class="time">{{ event.time }}</span>
			</div>
		</div>
	</div>

	<div v-if="eventCountdown.name" class="countdown-box">
		<span class="close material-symbols-outlined" @click="handleClose">
			close</span
		>
		<div class="gap">
			<div class="gap-item days">
				<span :style="`--degit:${numberDegit(eventCountdown.days)}`">
					{{ eventCountdown.days }}
				</span>
				days
			</div>
			<div class="gap-item hours">
				<span>{{ eventCountdown.hours }}</span> hours
			</div>
			<div class="gap-item minutes">
				<span>{{ eventCountdown.minutes }}</span> minutes
			</div>
			<div class="gap-item seconds">
				<span>{{ eventCountdown.seconds }}</span> seconds
			</div>
		</div>
		<div class="name">{{ eventCountdown.name }}</div>
	</div>

	<div v-else class="event-form">
		<input
			class="name"
			v-model="eventForm.name"
			placeholder="Please enter an event name"
			autocomplete="off"
		/>

		<div class="datetime">
			<input
				class="date"
				:min="formatToday.date"
				v-model="eventForm.date"
				type="date"
			/>
			<input class="time" v-model="eventForm.time" type="time" />
		</div>

		<button class="submit" @click="handleEventCreate">start</button>
	</div>
</template>

<style scoped lang="less">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");

@media screen and (max-width: 768px) {
	.event-container {
		visibility: hidden;
	}
}

.event-container {
	position: fixed;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	height: fit-content;
	max-width: 30%;
	max-height: 100vh;
	overflow-y: scroll;

	.event-card {
		min-width: 150px;
		width: fit-content;
		max-width: calc(100% - 4em - 6px);
		margin: 1em;
		padding: 0.5em 2em 0.5em 1em;
		border-radius: 8px;
		background-color: #333;
		text-align: left;
		border: 3px solid #666;
		transition: border-color 0.25s;
		cursor: pointer;

		.name {
			font-size: 1.2em;
			text-transform: capitalize;
			margin-bottom: 8px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.datetime {
			color: #999;
			display: flex;
			justify-content: space-between;
			font-family: Roboto Mono;
		}

		.date {
			margin-right: 1em;
		}

		&:hover {
			border-color: #eee;
		}
	}
}

.tips {
	color: red;
	margin: 1em 0;
	height: 1em;
}

.countdown-box {
	z-index: 999;
	width: 100%;
	border: 3px solid #ccc;
	background-color: #333333ee;
	box-shadow: 0 3px 5px 5px #666;
	padding: 2em 3em;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	user-select: none;

	.material-symbols-outlined {
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 2em;
		cursor: pointer;
		font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
	}

	.name {
		width: 100%;
		font-size: 32px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-top: 0.5em;
		margin-top: 1em;
		border-top: 3px dashed #999;
	}
	.gap {
		display: flex;
		.gap-item {
			margin: 15px 20px;
			display: flex;
			flex-direction: column;
			text-transform: uppercase;
			span {
				font-size: 5em;
				width: var(--degit, 100px);
				font-family: Roboto Mono;
			}
		}
	}
}

.event-form {
	display: flex;
	flex-direction: column;

	.name,
	.date,
	.time,
	.submit {
		text-align: center;
		height: 1.5em;
		font-size: 24px;
		padding: 10px 20px;
		margin-bottom: 1em;
	}

	.datetime {
		display: flex;
	}

	.date {
		margin-right: 1em;
		font-family: Roboto Mono;
	}

	.time {
		font-family: Roboto Mono;
	}

	.submit {
		height: auto;
		background-color: #333;
		border-color: #666;
		text-transform: uppercase;
	}
}
</style>
