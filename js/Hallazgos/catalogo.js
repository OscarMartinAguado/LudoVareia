/* =========================================================
   LUDOVAREIA — FILTRADO DE CATÁLOGOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const catalog = document.querySelector(".artifact-catalog");

  // Si la página no contiene un catálogo, no hacemos nada.
  if (!catalog) return;

  const cards = catalog.querySelectorAll(".artifact-card");
  const filters = catalog.querySelectorAll(".catalog-filter");
  const searchInput = catalog.querySelector("#objectSearch");
  const objectCount = catalog.querySelector("#objectCount");
  const catalogEmpty = catalog.querySelector("#catalogEmpty");

  // Categoría seleccionada inicialmente.
  let currentFilter = "todos";

  /* =====================================================
     FILTRAR OBJETOS
     ===================================================== */

  function filterCatalog() {
    const search = searchInput.value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    let visibleObjects = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";

      // Buscamos en nombre, categoría y descripción.
      const searchableText = [
        card.dataset.title || "",
        category,
        card.dataset.description || "",
        card.textContent || "",
      ]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const matchesCategory =
        currentFilter === "todos" || category === currentFilter;

      const matchesSearch = searchableText.includes(search);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) {
        visibleObjects++;
      }
    });

    // Actualizamos el contador.
    objectCount.textContent = visibleObjects;

    // Mostramos el mensaje cuando no hay resultados.
    catalogEmpty.hidden = visibleObjects !== 0;
  }

  /* =====================================================
     BOTONES DE CATEGORÍA
     ===================================================== */

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      filter.classList.add("is-active");
      filter.setAttribute("aria-pressed", "true");

      currentFilter = filter.dataset.filter;

      filterCatalog();
    });
  });

  /* =====================================================
     BUSCADOR
     ===================================================== */

  searchInput.addEventListener("input", filterCatalog);

  /* =====================================================
     INICIALIZAR
     ===================================================== */

  filterCatalog();
});
