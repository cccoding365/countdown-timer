<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { getDatetimeGap, formatToday } from "@/utils";
import { reactive, ref } from "vue";

const eventCountdown = ref({
	name: "",
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
});

let timer: any;

interface TipsOption {
	text: string;
	duration?: number;
}

interface Event {
	name: string;
	date: string;
	time: string;
}

const eventContainer = ref<Event[]>([
	{ name: "吃饭", date: "2022-02-04", time: "13:32" },
	{ name: "睡觉", date: "2023-02-03", time: "13:32" },
	{
		name: "打豆豆",
		date: "2024-02-06",
		time: "13:32",
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

	console.log(eventContainer.value);

	const gap = getDatetimeGap(targetDatetime, now);
	console.log({ name, date, time, gap });
};

const handleEventStart = (event: Event) => {
	const { name, date, time } = event;

	const targetDatetime = new Date(`${date} ${time}`).getTime();

	console.log(new Date(`${date} ${time}`));

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

interface EventForm {
	name: string;
	date: string;
	time: string;
}

const eventForm = reactive<EventForm>({
	name: "",
	date: formatToday.date,
	time: formatToday.time,
});
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
		<div class="name">{{ eventCountdown.name }}</div>
		<div class="gap">
			<div class="gap-item days">
				<span>{{ eventCountdown.days }}</span> days
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
	</div>

	<div v-else class="event-form">
		<input
			class="name"
			v-model="eventForm.name"
			minlength="1"
			maxlength="7"
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

		<button class="submit" @click="handleEventCreate">Create event</button>
	</div>
</template>

<style scoped lang="less">
@import url("https://fonts.googleapis.com/css2?family=Electrolize&display=swap");

@media screen and (max-width: 500px) {
	.event-container {
		display: none;
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
			font-size: 1.5em;
			margin-bottom: 8px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.datetime {
			color: #999;
			display: flex;
			justify-content: space-between;
			font-family: Electrolize;
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
	margin-bottom: 1em;
	height: 1em;
}

.countdown-box {
	width: 100%;
	background-color: #333;
	padding: 2em 5em;
	border-radius: 10px;
	margin: 3em 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	.name {
		width: 100%;
		font-size: 32px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.gap {
		display: flex;
		.gap-item {
			margin: 15px 20px;
			display: flex;
			flex-direction: column;
			text-transform: uppercase;
			span {
				font-size: 3em;
				font-family: Electrolize;
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

	.date {
		margin-right: 1em;
	}

	.submit {
		height: auto;
		border: 3px solid #666;
	}

	.datetime {
		display: flex;
	}
}
</style>
