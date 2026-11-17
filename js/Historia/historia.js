/* =========================================================
   POPUPS HISTÓRICOS
   ========================================================= */

document.querySelectorAll("[data-dialog-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialogId = button.dataset.dialogOpen;
    const dialog = document.getElementById(dialogId);

    if (dialog) {
      dialog.showModal();
    }
  });
});

/* Cerrar al pulsar fuera del contenido */

document.querySelectorAll(".history-dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});
