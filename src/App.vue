<script setup lang="ts">
import { reactive } from "vue";
import Logo from "./components/Logo.vue";

const getDatetimeGap = (timestamp1: number, timestamp2: number) => {
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
};

let event = reactive({
	name: "",
	datetime: "",
});

const handleEventStart = (e: any) => {
	e.preventDefault();

	const targetDatetime = new Date(event.datetime).getTime();
	const now = Date.now();

	const datetimeGap = getDatetimeGap(targetDatetime, now);

	console.log(datetimeGap);
};
</script>

<template>
	<Logo />
	<form class="event-form">
		<input v-model="event.name" class="event" type="text" />
		<input
			v-model="event.datetime"
			class="datetime"
			type="datetime-local"
		/>

		<button class="event-submit" type="submit" @click="handleEventStart">
			Create A Event
		</button>
	</form>
</template>

<style scoped>
.event-form {
	display: flex;
	flex-direction: column;
}
.event,
.datetime,
.event-submit {
	padding: 10px 20px;
	font-size: 24px;
	margin-bottom: 1em;
}
</style>
