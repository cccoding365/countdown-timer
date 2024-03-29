<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { Event, EventForm, CountdownBox } from "@/types";
import { getDatetimeGap, formatToday, Message } from "@/utils";
import { EventFormDefault, CountdownBoxDefault } from "@/constants";

const countdownBox = ref<CountdownBox>(CountdownBoxDefault);
const eventContainer = ref<Event[]>([]);
const eventForm = reactive<EventForm>(EventFormDefault);

let timer: any;

onMounted(() => {
	eventContainer.value =
		JSON.parse(localStorage.getItem("Events") as string) || [];
});

const handleEventDelete = ({ id }: Event) => {
	const delEventIdx = eventContainer.value.findIndex(e => e.id === id);
	eventContainer.value.splice(delEventIdx, 1);
	localStorage.setItem("Events", JSON.stringify(eventContainer.value));
	if (id === countdownBox.value.id) {
		countdownBox.value.name = "";
		timer && clearInterval(timer);
	}
};

const handleEventCreate = () => {
	const { name, date, time } = eventForm;

	let defaultName: string = "";

	if (!name) {
		defaultName = `Custom Event#${Math.random()
			.toString(36)
			.slice(2, 6)
			.toUpperCase()}`;
		Message({
			text: "You did not enter a name, a random name will be used!",
		});
	}
	if (!date) {
		return Message({ text: "The field 'date' is required!" });
	}
	if (!time) {
		return Message({ text: "The field 'time' is required!" });
	}

	const targetDatetime = new Date(`${date} ${time}`).getTime();
	const now = Date.now();

	if (targetDatetime <= now) {
		return Message({
			text: "The target time must be later than the current time!",
		});
	}

	const customName = eventForm.name.includes("@") ? name.split("@")[0] : name;
	const label = eventForm.name.includes("@") ? name.split("@")[1] : "";

	const eventObj: Event = {
		id: Date.now(),
		name: customName || defaultName,
		date,
		time,
		status: "doing",
		label,
	};
	eventContainer.value.unshift(eventObj);

	localStorage.setItem("Events", JSON.stringify(eventContainer.value));

	handleEventStart(eventObj);
};

const handleEventStart = (event: Event) => {
	const { id, date, time } = event;

	const targetDatetime = new Date(`${date} ${time}`).getTime();

	timer && clearInterval(timer);

	const now = Date.now();
	countdownBox.value = {
		...event,
		...getDatetimeGap(targetDatetime, now),
	};

	timer = setInterval(() => {
		const now = Date.now();
		if (targetDatetime - now <= 0) {
			clearInterval(timer);
			eventContainer.value.find(e => e.id === id)!.status = "done";
			localStorage.setItem(
				"Events",
				JSON.stringify(eventContainer.value),
			);
			return;
		}
		countdownBox.value = {
			...event,
			...getDatetimeGap(targetDatetime, now),
		};
	}, 1000);
};

const numberDegit = (num: number) => {
	return String(num).padStart(2, "0").length * 50 + "px";
};

const handleClose = () => {
	countdownBox.value.name = "";
	clearInterval(timer);
};

watch(eventForm, oldValue => {
	if (oldValue.name.includes("@")) {
		eventForm.label = oldValue.name.split("@")[1];
	}
});
</script>

<template>
	<Logo />

	<div id="tips" class="tips"></div>

	<div v-if="countdownBox.name" class="countdown-box">
		<span class="close material-symbols-outlined" @click="handleClose">
			close
		</span>
		<div class="gap">
			<div v-if="countdownBox.days" class="gap-item days">
				<span :style="`--degit:${numberDegit(countdownBox.days)}`">
					{{ countdownBox.days }}
				</span>
				days
			</div>
			<div class="gap-item hours">
				<span>{{ countdownBox.hours }}</span> hours
			</div>
			<div class="gap-item minutes">
				<span>{{ countdownBox.minutes }}</span> minutes
			</div>
			<div class="gap-item seconds">
				<span>{{ countdownBox.seconds }}</span> seconds
			</div>
		</div>
		<div class="name">{{ countdownBox.name }}</div>
	</div>

	<form v-else class="event-form" @submit.prevent="handleEventCreate">
		<input
			class="form-item name"
			v-model="eventForm.name"
			placeholder="Please enter an event name"
			autocomplete="off"
			@keyup.enter="handleEventCreate"
		/>

		<div class="datetime">
			<input
				class="form-item date"
				:min="formatToday.date"
				v-model="eventForm.date"
				type="date"
			/>
			<input
				class="form-item time"
				v-model="eventForm.time"
				type="time"
			/>
		</div>

		<button class="form-item button submit" type="submit">start</button>
	</form>

	<div class="event-container">
		<div
			v-for="event in eventContainer"
			class="event-card"
			:class="event.status"
			@click="handleEventStart(event)"
		>
			<div class="name">{{ event.name }}</div>
			<div class="datetime">
				<span class="date">{{ event.date }}</span>
				<span class="time">{{ event.time }}</span>
			</div>
			<div v-if="event.label" class="label">{{ event.label }}</div>
			<div
				class="close material-symbols-outlined"
				@click.stop="handleEventDelete(event)"
			>
				close
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");

@media screen and (max-width: 820px) {
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
		padding: 0.5em 3em 0.5em 1em;
		border-radius: 8px;
		background-color: #333;
		text-align: left;
		border: 2px solid #666;
		transition: border-color 0.25s;
		cursor: pointer;
		position: relative;

		&.doing {
			--labelColor: rgb(144, 238, 144);
			--labelBackgroundColor: rgba(144, 238, 144, 0.3);
		}

		&.done {
			--labelColor: rgb(240, 128, 128);
			--labelBackgroundColor: rgba(240, 128, 128, 0.3);
		}

		.close {
			position: absolute;
			right: 7px;
			top: 7px;
		}

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

		.label {
			font-size: 0.7em;
			margin-top: 8px;
			width: fit-content;
			border-radius: 999px;
			padding: 0 15px;
			border: 1px solid var(--labelColor);
			color: var(--labelColor);
			background-color: var(--labelBackgroundColor);
		}

		&:hover {
			border-color: var(--labelColor);
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

	.form-item {
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

	.button {
		height: auto;
		background-color: #333;
		border-color: #666;
		text-transform: uppercase;
	}
}
</style>
