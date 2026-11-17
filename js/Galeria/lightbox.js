const lightbox = document.querySelector("#gallery-lightbox");

if (lightbox) {
  const images = [
    ...document.querySelectorAll(".gallery--page .gallery__item img"),
  ];
  const modalImage = document.querySelector("#lightbox-image");
  const caption = document.querySelector("#lightbox-caption");
  const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
  const prevButton = lightbox.querySelector(".lightbox__nav--prev");
  const nextButton = lightbox.querySelector(".lightbox__nav--next");

  let currentIndex = 0;
  let previousFocus = null;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;

    const selected = images[currentIndex];

    modalImage.src = selected.src;
    modalImage.alt = selected.alt;
    caption.textContent = selected.alt;

    const url = new URL(window.location.href);
    url.searchParams.set("imagen", currentIndex);
    window.history.replaceState({}, "", url);
  }

  function openLightbox(index) {
    previousFocus = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox__close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";

    const url = new URL(window.location.href);
    url.searchParams.delete("imagen");
    window.history.replaceState({}, "", url);

    if (previousFocus) previousFocus.focus();
  }

  images.forEach((image, index) => {
    image.closest("a").addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(index);
    });
  });

  prevButton.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  const requestedImage = Number(
    new URLSearchParams(window.location.search).get("imagen"),
  );

  const hasImageParameter = new URLSearchParams(window.location.search).has(
    "imagen",
  );

  if (
    hasImageParameter &&
    Number.isInteger(requestedImage) &&
    requestedImage >= 0 &&
    requestedImage < images.length
  ) {
    openLightbox(requestedImage);
  }
}
