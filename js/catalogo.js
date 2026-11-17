/*
 * =========================================================
 * LUDOVAREIA — CATÁLOGO INTERACTIVO
 * =========================================================
 */

/*
 * =========================================================
 * DATOS DE LOS OBJETOS
 * =========================================================
 */

const objects = {
  anfora: {
    title: "Ánfora romana",
    category: "VAREIA · CERÁMICA",
    image: "../img/anfora.jpg",
    description:
      "Las ánforas eran recipientes cerámicos utilizados principalmente para transportar y almacenar productos. Su presencia ayuda a conocer las relaciones comerciales y el consumo de productos en época romana.",
    period: "Época romana",
    material: "Cerámica",
    use: "Transporte y almacenamiento",
  },

  moneda: {
    title: "Moneda romana",
    category: "VAREIA · NUMISMÁTICA",
    image: "../img/moneda.jpg",
    description:
      "Las monedas constituyen una importante fuente arqueológica para estudiar la economía, el comercio y las relaciones entre diferentes territorios durante la época romana.",
    period: "Época romana",
    material: "Metal",
    use: "Comercio y economía",
  },

  vasija: {
    title: "Vasija cerámica",
    category: "VAREIA · CERÁMICA",
    image: "../img/vasija.jpg",
    description:
      "Las vasijas formaban parte de la vida cotidiana. Se utilizaban para almacenar alimentos, preparar productos o servir diferentes tipos de comida.",
    period: "Época romana",
    material: "Cerámica",
    use: "Uso doméstico",
  },

  lucerna: {
    title: "Lucerna romana",
    category: "VAREIA · VIDA COTIDIANA",
    image: "../img/lucerna.jpg",
    description:
      "Las lucernas eran pequeñas lámparas alimentadas normalmente con aceite. Permitían iluminar viviendas y otros espacios durante la noche.",
    period: "Época romana",
    material: "Cerámica",
    use: "Iluminación",
  },

  herramienta: {
    title: "Herramienta romana",
    category: "VAREIA · VIDA COTIDIANA",
    image: "../img/herramienta.jpg",
    description:
      "Las herramientas encontradas en contextos arqueológicos permiten conocer los trabajos y actividades desarrollados por las comunidades que habitaron el asentamiento.",
    period: "Época romana",
    material: "Metal",
    use: "Trabajo y construcción",
  },

  denario: {
    title: "Denario romano",
    category: "VAREIA · NUMISMÁTICA",
    image: "../img/denario.jpg",
    description:
      "El denario fue una de las monedas más importantes del sistema monetario romano. Su estudio proporciona información sobre la economía y las conexiones comerciales.",
    period: "Época romana",
    material: "Plata",
    use: "Comercio y economía",
  },
};

/*
 * =========================================================
 * ELEMENTOS DEL DOM
 * =========================================================
 */

const cards = document.querySelectorAll(".object-card");

const filters = document.querySelectorAll(".catalog-filter");

const searchInput = document.getElementById("objectSearch");

const objectCount = document.getElementById("objectCount");

const catalogEmpty = document.getElementById("catalogEmpty");

const modal = document.getElementById("objectModal");

const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");

const modalCategory = document.getElementById("modalCategory");

const modalDescription = document.getElementById("modalDescription");

const modalPeriod = document.getElementById("modalPeriod");

const modalMaterial = document.getElementById("modalMaterial");

const modalUse = document.getElementById("modalUse");

/*
 * =========================================================
 * FILTRO ACTUAL
 * =========================================================
 */

let currentFilter = "todos";

/*
 * =========================================================
 * FILTRAR CATÁLOGO
 * =========================================================
 */

function filterCatalog() {
  const search = searchInput.value.toLowerCase().trim();

  let visibleObjects = 0;

  cards.forEach((card) => {
    const category = card.dataset.category;

    const name = card.dataset.name.toLowerCase();

    const matchesCategory =
      currentFilter === "todos" || category === currentFilter;

    const matchesSearch = name.includes(search);

    const visible = matchesCategory && matchesSearch;

    card.style.display = visible ? "" : "none";

    if (visible) {
      visibleObjects++;
    }
  });

  objectCount.textContent = visibleObjects;

  catalogEmpty.hidden = visibleObjects !== 0;
}

/*
 * =========================================================
 * BOTONES DE FILTRO
 * =========================================================
 */

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => {
      item.classList.remove("is-active");
    });

    filter.classList.add("is-active");

    currentFilter = filter.dataset.filter;

    filterCatalog();
  });
});

/*
 * =========================================================
 * BUSCADOR
 * =========================================================
 */

searchInput.addEventListener("input", filterCatalog);

/*
 * =========================================================
 * ABRIR INFORMACIÓN DEL OBJETO
 * =========================================================
 */

document.querySelectorAll("[data-object]").forEach((button) => {
  button.addEventListener("click", () => {
    const object = objects[button.dataset.object];

    if (!object) {
      return;
    }

    /*
     * Rellenamos el modal
     */

    modalImage.src = object.image;

    modalImage.alt = object.title;

    modalTitle.textContent = object.title;

    modalCategory.textContent = object.category;

    modalDescription.textContent = object.description;

    modalPeriod.textContent = object.period;

    modalMaterial.textContent = object.material;

    modalUse.textContent = object.use;

    /*
     * Mostramos el modal
     */

    modal.classList.add("is-open");

    modal.setAttribute("aria-hidden", "false");

    /*
     * Evitamos que se pueda
     * hacer scroll por detrás
     */

    document.body.style.overflow = "hidden";
  });
});

/*
 * =========================================================
 * CERRAR MODAL
 * =========================================================
 */

function closeObjectModal() {
  modal.classList.remove("is-open");

  modal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

/*
 * Botón X
 */

closeModal.addEventListener("click", closeObjectModal);

/*
 * Clicar fuera del contenido
 */

document
  .querySelector("[data-close-modal]")
  .addEventListener("click", closeObjectModal);

/*
 * =========================================================
 * CERRAR CON ESC
 * =========================================================
 */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeObjectModal();
  }
});

/*
 * =========================================================
 * INICIALIZAR CATÁLOGO
 * =========================================================
 */

filterCatalog();
