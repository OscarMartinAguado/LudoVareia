document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".reviews-section");

  if (!section) return;

  // ELEMENTOS DEL POPUP

  const popup = document.getElementById("review-popup");
  const overlay = document.getElementById("review-overlay");

  const openPopup = document.getElementById("open-review-popup");
  const closePopup = document.getElementById("close-review-popup");

  // ABRIR POPUP

  function showReviewPopup() {
    popup.hidden = false;
    overlay.hidden = false;

    document.getElementById("review-name").focus();

    document.body.style.overflow = "hidden";
  }

  // CERRAR POPUP

  function hideReviewPopup() {
    popup.hidden = true;
    overlay.hidden = true;

    document.body.style.overflow = "";

    openPopup.focus();
  }

  // EVENTOS

  openPopup.addEventListener("click", showReviewPopup);

  closePopup.addEventListener("click", hideReviewPopup);

  overlay.addEventListener("click", hideReviewPopup);

  // CERRAR CON ESCAPE

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) {
      hideReviewPopup();
    }
  });

  // Obtener el identificador de la actividad desde la URL
  const params = new URLSearchParams(window.location.search);

  const activity = params.get("id");

  if (!activity) {
    console.error("No se ha encontrado el identificador de la actividad.");
    return;
  }

  // Clave independiente para cada actividad
  const STORAGE_KEY = `ludovareia_resenas_${activity}`;

  // Elementos HTML
  const list = document.getElementById("reviews-list");
  const form = document.getElementById("review-form");

  const average = document.getElementById("reviews-average");
  const averageStars = document.getElementById("reviews-average-stars");
  const count = document.getElementById("reviews-count");

  const message = document.getElementById("review-message");

  // Generar estrellas
  function stars(value) {
    return "★".repeat(value) + "☆".repeat(5 - value);
  }

  // Recuperar reseñas del navegador
  function getReviews() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error leyendo las reseñas:", error);
      return [];
    }
  }

  // Guardar reseñas en el navegador
  function saveReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

      return true;
    } catch (error) {
      console.error("Error guardando las reseñas:", error);
      return false;
    }
  }

  // Mostrar reseñas
  function renderReviews() {
    const reviews = getReviews();

    list.replaceChildren();

    // Sin reseñas
    if (reviews.length === 0) {
      list.textContent =
        "Todavía no hay reseñas. ¡Sé la primera persona en opinar!";

      average.textContent = "0.0";
      averageStars.textContent = stars(0);
      count.textContent = "0 reseñas";

      return;
    }

    // Calcular valoración media
    const total = reviews.reduce(
      (sum, review) => sum + Number(review.puntuacion),
      0,
    );

    const avg = total / reviews.length;

    average.textContent = avg.toFixed(1);
    averageStars.textContent = stars(Math.round(avg));

    count.textContent = `${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"}`;

    // Ordenar de más reciente a más antigua
    reviews.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Crear tarjetas
    reviews.forEach((review) => {
      const article = document.createElement("article");
      article.className = "review-card";

      const header = document.createElement("div");
      header.className = "review-card__header";

      const name = document.createElement("strong");
      name.textContent = review.nombre;

      const rating = document.createElement("span");
      rating.className = "review-card__stars";
      rating.textContent = stars(Number(review.puntuacion));

      const comment = document.createElement("p");
      comment.textContent = review.comentario;

      const date = document.createElement("small");
      date.textContent = new Date(review.fecha).toLocaleDateString("es-ES");

      header.append(name, rating);
      article.append(header, comment, date);

      list.appendChild(article);
    });
  }

  // Publicar una reseña
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("review-name").value.trim();

    const comentario = document.getElementById("review-comment").value.trim();

    const selected = form.querySelector('input[name="puntuacion"]:checked');

    // Validaciones
    if (nombre.length < 2 || nombre.length > 50) {
      message.textContent = "Introduce un nombre válido.";
      return;
    }

    if (comentario.length === 0 || comentario.length > 1000) {
      message.textContent = "Introduce un comentario válido.";
      return;
    }

    if (!selected) {
      message.textContent = "Selecciona una puntuación.";
      return;
    }

    // Crear objeto de reseña
    const review = {
      id: crypto.randomUUID(),
      actividad: activity,
      nombre: nombre,
      puntuacion: Number(selected.value),
      comentario: comentario,
      fecha: new Date().toISOString(),
    };

    // Recuperar reseñas anteriores
    const reviews = getReviews();

    // Añadir nueva reseña
    reviews.push(review);

    // Guardar
    if (!saveReviews(reviews)) {
      message.textContent = "No se pudo guardar la reseña en este navegador.";

      return;
    }

    // Confirmación
    message.textContent = "¡Gracias por compartir tu experiencia!";

    // Limpiar formulario
    form.reset();

    // Actualizar listado y valoración media
    renderReviews();

    // Cerrar popup
    hideReviewPopup();
  });

  // Inicializar sistema
  renderReviews();
});
