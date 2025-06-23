export const deleteCard = function (element) {
  element.remove();
};

export const likeCard = function (element) {
  element.classList.toggle("card__like-button_is-active");
};

export const addCard = function (
  imgValue,
  titleValue,
  deleteCardCallback,
  openModalCallback,
  likeCardCallback
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const typeImgPopup = document.querySelector(".popup_type_image");
  const imgPopup = typeImgPopup.querySelector(".popup__image");
  const captionPopup = typeImgPopup.querySelector(".popup__caption");

  cardImage.src = imgValue;
  cardImage.alt = titleValue;
  cardElement.querySelector(".card__title").textContent = titleValue;

  deleteButton.addEventListener("click", function () {
    deleteCardCallback(cardElement);
  });

  likeButton.addEventListener("click", function () {
    likeCardCallback(likeButton);
  });

  cardImage.addEventListener("click", function () {
    imgPopup.src = imgValue;
    imgPopup.alt = titleValue;
    captionPopup.textContent = titleValue;
    openModalCallback(typeImgPopup);
  });

  return cardElement;
};
