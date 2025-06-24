const handleEscKeyUp = function (evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened");
    closeModal(popup);
  }
};

export const openModal = function (modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscKeyUp);
};

export const closeModal = function (modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscKeyUp);
};

export const handleCloseModal = function (element) {
  const closePopup = element.querySelector(".popup__close");
  closePopup.addEventListener("click", function () {
    closeModal(element);
  });

  element.addEventListener("mousedown", function (event) {
    if (event.target.classList.contains("popup")) {
      closeModal(element);
    }
  });
};
