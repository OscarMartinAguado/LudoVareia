window.activities = [
	{
		id: "visita-vareia",
		title: "Paseo por la Vareia romana",
		category: "Visita guiada",
		date: "2026-11-07",
		time: "10:30",
		duration: "90 minutos",
		age: "Todos los públicos",
		image: "../img/galeria/galeria-ciudad.png",
		alt: "Reconstrucción de una ciudad romana",
		description:
			"Recorre los espacios más representativos del yacimiento y descubre cómo era la vida en Vareia. Una visita pausada para observar el paisaje, las huellas arqueológicas y la historia del asentamiento.",
	},
	{
		id: "taller-mosaico",
		title: "Taller de mosaico romano",
		category: "Taller",
		date: "2026-11-14",
		time: "11:00",
		duration: "2 horas",
		age: "A partir de 8 años",
		image: "../img/galeria/galeria-mosaico.png",
		alt: "Detalle de un mosaico romano",
		description:
			"Conoce los motivos y técnicas de los mosaicos romanos y crea una pequeña composición inspirada en los diseños de la Antigüedad. Actividad práctica para compartir en familia.",
	},
	{
		id: "vareia-en-familia",
		title: "Vareia en familia",
		category: "Actividad familiar",
		date: "2026-11-21",
		time: "11:00",
		duration: "75 minutos",
		age: "A partir de 6 años",
		image: "../img/galeria/galeria-paisaje.png",
		alt: "Paisaje del entorno de Vareia",
		description:
			"Una ruta con pequeñas pistas para que mayores y pequeños exploren el entorno del yacimiento. Mirar, preguntar y descubrir serán las claves de este recorrido compartido.",
	},
	{
		id: "arqueologia-por-un-dia",
		title: "Arqueología por un día",
		category: "Taller",
		date: "2026-11-28",
		time: "10:00",
		duration: "2 horas",
		age: "A partir de 10 años",
		image: "../img/galeria/galeria-ceramica.png",
		alt: "Pieza de cerámica arqueológica",
		description:
			"Acércate al trabajo arqueológico: observa materiales, plantea hipótesis y aprende por qué el contexto de un objeto es tan importante como el objeto mismo.",
	},
	{
		id: "huellas-en-ceramica",
		title: "Huellas en la cerámica",
		category: "Taller",
		date: "2026-12-05",
		time: "11:00",
		duration: "90 minutos",
		age: "A partir de 7 años",
		image: "../img/galeria/galeria-ceramica.png",
		alt: "Cerámica romana",
		description:
			"¿Qué nos cuenta una vasija? Explora formas y usos de la cerámica romana y experimenta con texturas y marcas en una actividad creativa para todas las edades indicadas.",
	},
];

const upcomingList = document.getElementById("upcoming-list");
const calendarDays = document.getElementById("calendar-days");

function parseActivityDate(dateString) {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function formatActivityDate(dateString, options = { day: "numeric", month: "short" }) {
	return new Intl.DateTimeFormat("es-ES", options).format(
		parseActivityDate(dateString),
	);
}

function activityLink(activity) {
	return `actividad-detalle.html?id=${encodeURIComponent(activity.id)}`;
}

if (upcomingList && calendarDays) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const upcomingActivities = window.activities
		.filter((activity) => parseActivityDate(activity.date) >= today)
		.sort((first, second) => first.date.localeCompare(second.date));

	if (upcomingActivities.length) {
		upcomingList.innerHTML = upcomingActivities
			.slice(0, 3)
			.map(
				(activity) => `
					<a class="upcoming-card" href="${activityLink(activity)}">
						<img class="upcoming-card__image" src="${activity.image}" alt="${activity.alt}" />
						<span class="upcoming-card__body">
							<span class="upcoming-card__date">${formatActivityDate(activity.date)} · ${activity.time}</span>
							<span class="upcoming-card__title">${activity.title}</span>
							<span class="upcoming-card__link">Ver actividad →</span>
						</span>
					</a>`,
			)
			.join("");
	} else {
		upcomingList.innerHTML = '<p class="activities-empty">No hay actividades programadas próximamente.</p>';
	}

	const nearestDate = upcomingActivities[0]
		? parseActivityDate(upcomingActivities[0].date)
		: today;
	let displayedMonth = new Date(nearestDate.getFullYear(), nearestDate.getMonth(), 1);
	const monthLabel = document.getElementById("calendar-month");

	function renderCalendar() {
		const year = displayedMonth.getFullYear();
		const month = displayedMonth.getMonth();
		const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const calendarStart = new Date(year, month, 1 - firstWeekday);
		const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

		monthLabel.textContent = new Intl.DateTimeFormat("es-ES", {
			month: "long",
			year: "numeric",
		}).format(displayedMonth);

		calendarDays.innerHTML = Array.from({ length: cellCount }, (_, index) => {
			const date = new Date(calendarStart);
			date.setDate(calendarStart.getDate() + index);
			const dateString = [
				date.getFullYear(),
				String(date.getMonth() + 1).padStart(2, "0"),
				String(date.getDate()).padStart(2, "0"),
			].join("-");
			const matches = window.activities.filter((activity) => activity.date === dateString);
			const isOutsideMonth = date.getMonth() !== month;
			const isToday = date.toDateString() === today.toDateString();
			const classes = [
				"calendar__day",
				isOutsideMonth ? "calendar__day--outside" : "",
				isToday ? "calendar__day--today" : "",
			].filter(Boolean).join(" ");
			const eventLinks = matches
				.map((activity) => `<a class="calendar__event" href="${activityLink(activity)}" aria-label="${activity.title}, ${activity.time}">${activity.time} · ${activity.title}</a>`)
				.join("");

			return `<div class="${classes}" role="gridcell"><span class="calendar__number">${date.getDate()}</span>${eventLinks}</div>`;
		}).join("");
	}

	document.getElementById("month-prev").addEventListener("click", () => {
		displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
		renderCalendar();
	});

	document.getElementById("month-next").addEventListener("click", () => {
		displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
		renderCalendar();
	});

	renderCalendar();
}
