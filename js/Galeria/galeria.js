const track = document.querySelector(".gallery__track");

const items = document.querySelectorAll(".gallery__item");

const prevButton = document.querySelector(".gallery__control--prev");

const nextButton = document.querySelector(".gallery__control--next");

const dots = document.querySelectorAll(".gallery-dot");

const dotsContainer = document.querySelector(".gallery-dots");

let currentIndex = 0;

/* =========================================================
   COMPROBAR QUE EXISTE LA GALERÍA
   ========================================================= */

if (track && items.length > 0 && prevButton && nextButton) {
  /* =======================================================
     OBTENER NÚMERO DE IMÁGENES VISIBLES
     ======================================================= */

  function getVisibleItems() {
    const styles = window.getComputedStyle(track);

    return Number(styles.getPropertyValue("--gallery-visible")) || 4;
  }

  /* =======================================================
     OBTENER ÚLTIMA POSICIÓN
     ======================================================= */

  function getMaxIndex() {
    return Math.max(0, items.length - getVisibleItems());
  }

  /* =======================================================
     ACTUALIZAR GALERÍA
     ======================================================= */

  function updateGallery() {
    const maxIndex = getMaxIndex();

    // Evitar posiciones fuera del carrusel
    currentIndex = Math.min(currentIndex, maxIndex);

    // Desplazamiento según la posición real de la imagen
    const move = items[currentIndex].offsetLeft;

    track.style.transform = `translateX(-${move}px)`;

    /* ACTUALIZAR INDICADORES */

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;

      dot.hidden = index > maxIndex;

      dot.classList.toggle("is-active", isActive);

      dot.setAttribute("aria-current", String(isActive));
    });

    if (dotsContainer) {
      dotsContainer.hidden = maxIndex === 0;
    }

    /* MOSTRAR U OCULTAR FLECHAS */

    prevButton.hidden = maxIndex === 0;
    nextButton.hidden = maxIndex === 0;
  }

  /* =======================================================
     SIGUIENTE
     ======================================================= */

  nextButton.addEventListener("click", () => {
    const maxIndex = getMaxIndex();

    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }

    updateGallery();
  });

  /* =======================================================
     ANTERIOR
     ======================================================= */

  prevButton.addEventListener("click", () => {
    const maxIndex = getMaxIndex();

    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }

    updateGallery();
  });

  /* =======================================================
     INDICADORES
     ======================================================= */

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (index <= getMaxIndex()) {
        currentIndex = index;
        updateGallery();
      }
    });
  });

  /* =======================================================
     RESPONSIVE
     ======================================================= */

  window.addEventListener("resize", updateGallery);

  /* =======================================================
     INICIO
     ======================================================= */

  updateGallery();
}
