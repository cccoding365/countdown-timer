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

const tipsHandler = ({ text, duration = 2000 }: TipsOption) => {
	tips.value = text;
	setTimeout(() => {
		tips.value = "";
	}, duration);
};

const handleEventCreate = (e: any) => {
	e.preventDefault();

	const name = e.target.form.name.value;
	const date = e.target.form.date.value;
	const time = e.target.form.time.value;

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

	const gap = getDatetimeGap(targetDatetime, now);
	console.log({ name, date, time, gap });

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

	<form v-else class="event-form">
		<input
			class="name"
			name="name"
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
				name="date"
			/>
			<input
				class="time"
				v-model="eventForm.time"
				type="time"
				name="time"
			/>
		</div>

		<button class="submit" type="submit" @click="handleEventCreate">
			Create event
		</button>
	</form>
</template>

<style scoped lang="less">
.tips {
	color: red;
	margin-bottom: 1em;
}
.countdown-box {
	background-color: #333;
	padding: 2em 5em;
	border-radius: 10px;
	margin: 3em 0;
	.name {
		font-size: 32px;
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
