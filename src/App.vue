<script setup lang="ts">
import { reactive } from "vue";
import Logo from "@/components/Logo.vue";

import { Event } from "@/types";

import CountdownEvent from "@/classes";

let event: Event = reactive({
	name: "",
	datetime: "2023-11-25T13:20",
});

const handleEventCreate = (e: any) => {
	e.preventDefault();

	const countdownEvent = new CountdownEvent(event);

	console.log(countdownEvent);
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

		<button class="event-submit" type="submit" @click="handleEventCreate">
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
