export const getDatetimeGap = (timestamp1: number, timestamp2: number) => {
	const gap = Math.abs(timestamp1 - timestamp2) / 1000;

	return {
		days: Math.floor(gap / 86400),
		hours: Math.floor((gap % 86400) / 3600),
		minutes: Math.floor((gap % 3600) / 60),
		seconds: Math.floor(gap % 60),
	};
};

export const formatToday = {
	date: new Date().toLocaleDateString().replaceAll("/", "-"),
	time: new Date().toLocaleTimeString().slice(0, 5),
};
