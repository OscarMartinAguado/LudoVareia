document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("map-modal");
  const trigger = document.getElementById("open-map");

  if (!modal || !trigger) return;

  const closeButton = modal.querySelector(".map-modal__close");
  const closeElements = modal.querySelectorAll("[data-map-close]");

  function openMap() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeMap() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";
    trigger.focus();
  }

  trigger.addEventListener("click", openMap);

  closeElements.forEach((element) => {
    element.addEventListener("click", closeMap);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeMap();
    }
  });
});
