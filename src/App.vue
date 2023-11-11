<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { computed, ref } from "vue";

const formatToday = computed(() => ({
	date: new Date().toLocaleDateString().replaceAll("/", "-"),
	time: new Date().toLocaleTimeString().slice(0, 5),
}));

const getDatetimeGap = (timestamp1: number, timestamp2: number) => {
	const gap = Math.abs(timestamp1 - timestamp2) / 1000;

	return {
		days: Math.floor(gap / 86400),
		hours: Math.floor((gap % 86400) / 3600),
		minutes: Math.floor((gap % 3600) / 60),
		seconds: Math.floor(gap % 60),
	};
};

const eventCountdown = ref({
	name: "",
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
});

const handleEventCreate = (e: any) => {
	e.preventDefault();

	const name = e.target.form.name.value;
	const date = e.target.form.date.value;
	const time = e.target.form.time.value;

	const targetDatetime = new Date(`${date} ${time}`).getTime();

	setInterval(() => {
		const now = Date.now();

		// const gap = getDatetimeGap(targetDatetime, now);
		// console.log({ name, date, time, gap });

		eventCountdown.value = { name, ...getDatetimeGap(targetDatetime, now) };
	}, 1000);
};
</script>

<template>
	<Logo />
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
			value="Custom Event"
			placeholder="Please enter an event name"
			autocomplete="off"
			required
		/>

		<div class="datetime">
			<input
				class="date"
				:min="formatToday.date"
				:value="formatToday.date"
				type="date"
				name="date"
			/>
			<input
				class="time"
				:value="formatToday.time"
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

	.name:invalid {
		border-color: red;
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
