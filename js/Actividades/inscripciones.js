const activityId = new URLSearchParams(window.location.search).get("id");
const selectedActivity = window.activities.find((activity) => activity.id === activityId);
const registrationForm = document.getElementById("registration-form");
const activityLayout = document.querySelector(".activity-layout");
const robotsMeta = document.querySelector('meta[name="robots"]');

if (!selectedActivity) {
	document.title = "Actividad no disponible | LudoVareia";
	robotsMeta?.setAttribute("content", "noindex,follow");
	document.getElementById("activity-detail").innerHTML = `
		<div class="activity-detail__content">
			<p class="eyebrow">LudoVareia · Actividades</p>
			<h1>Actividad no disponible</h1>
			<p class="activity-detail__description">No encontramos esta actividad. Consulta el calendario para ver las propuestas programadas.</p>
			<a class="btn btn--primary" href="actividades.html">Ver actividades <span aria-hidden="true">→</span></a>
		</div>`;
	activityLayout.classList.add("activity-layout--unavailable");
	registrationForm.closest(".registration-section").hidden = true;
	document.querySelector(".activity-layout__reviews").hidden = true;
} else {
	document.title = `${selectedActivity.title} | LudoVareia`;
	robotsMeta?.setAttribute("content", "index,follow");

	const canonicalUrl = new URL("https://ludovareia.vercel.app/html/actividad-detalle.html");
	canonicalUrl.searchParams.set("id", selectedActivity.id);

	let canonicalLink = document.querySelector('link[rel="canonical"]');
	if (!canonicalLink) {
		canonicalLink = document.createElement("link");
		canonicalLink.rel = "canonical";
		document.head.append(canonicalLink);
	}
	canonicalLink.href = canonicalUrl.href;

	document.querySelector('meta[name="description"]')?.setAttribute("content", selectedActivity.description);
	document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
	document.querySelector('meta[property="og:description"]')?.setAttribute("content", selectedActivity.description);
	document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl.href);
	document.querySelector('meta[property="og:image:alt"]')?.setAttribute("content", selectedActivity.alt);
	document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
	document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", selectedActivity.description);
	const socialImage = new URL(selectedActivity.image, "https://ludovareia.vercel.app/html/actividad-detalle.html");
	document.querySelector('meta[property="og:image"]')?.setAttribute("content", socialImage.href);
	document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", socialImage.href);
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
	message.textContent = `Demostración guardada en este dispositivo. No se ha enviado ni reservado plaza para «${selectedActivity.title}».`;
	message.hidden = false;
	registrationForm.reset();
	document.getElementById("registration-activity").value = selectedActivity.id;
	message.focus();
});
