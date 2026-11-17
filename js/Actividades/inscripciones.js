const activityId = new URLSearchParams(window.location.search).get("id");
const selectedActivity = window.activities.find((activity) => activity.id === activityId);
const registrationForm = document.getElementById("registration-form");

if (!selectedActivity) {
	document.getElementById("activity-detail").innerHTML = `
		<div class="activity-detail__content">
			<p class="eyebrow">LudoVareia · Actividades</p>
			<h1>Actividad no disponible</h1>
			<p class="activity-detail__description">No encontramos esta actividad. Consulta el calendario para ver las propuestas programadas.</p>
			<a class="btn btn--primary" href="actividades.html">Ver actividades <span aria-hidden="true">→</span></a>
		</div>`;
	registrationForm.hidden = true;
} else {
	document.title = `${selectedActivity.title} | LudoVareia`;
	document.getElementById("activity-image").src = selectedActivity.image;
	document.getElementById("activity-image").alt = selectedActivity.alt;
	document.getElementById("activity-category").textContent = selectedActivity.category;
	document.getElementById("activity-title").textContent = selectedActivity.title;
	document.getElementById("activity-description").textContent = selectedActivity.description;
	document.getElementById("activity-date").textContent = new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(`${selectedActivity.date}T12:00:00`));
	document.getElementById("activity-time").textContent = selectedActivity.time;
	document.getElementById("activity-duration").textContent = selectedActivity.duration;
	document.getElementById("activity-age").textContent = selectedActivity.age;
	document.getElementById("registration-activity").value = selectedActivity.id;
}

registrationForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!registrationForm.reportValidity() || !selectedActivity) return;

	const formData = new FormData(registrationForm);
	const registration = {
		activityId: selectedActivity.id,
		name: formData.get("name").trim(),
		email: formData.get("email").trim(),
		phone: formData.get("phone").trim(),
		attendees: Number(formData.get("attendees")),
		createdAt: new Date().toISOString(),
	};

	try {
		const registrations = JSON.parse(localStorage.getItem("ludovareia-inscripciones") || "[]");
		registrations.push(registration);
		localStorage.setItem("ludovareia-inscripciones", JSON.stringify(registrations));
	} catch {
		document.getElementById("registration-message").textContent =
			"No se pudo guardar la inscripción en este navegador. Comprueba que el almacenamiento local está disponible e inténtalo de nuevo.";
		document.getElementById("registration-message").hidden = false;
		return;
	}

	const message = document.getElementById("registration-message");
	message.textContent = `¡Listo, ${registration.name}! Tu solicitud para «${selectedActivity.title}» se ha guardado en este dispositivo.`;
	message.hidden = false;
	registrationForm.reset();
	document.getElementById("registration-activity").value = selectedActivity.id;
	message.focus();
});
