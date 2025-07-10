export const createCard = function (
  userData,
  cardData,
  {
    openModalCallback,
    deleteCardCallback,
    closeModalCallback,
    toggleLikeCardCallback,
    ImgPopupCallback,
  }
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const likeNumber = cardElement.querySelector(".card__like-number");
  const deletePopup = document.querySelector(".popup_type_delete");
  const formElementDeleteCard = deletePopup.querySelector(".popup__form");
  cardElement.dataset.id = cardData._id;

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  likeNumber.textContent = cardData.likes.length;

  if (userData._id !== cardData.owner._id) {
    deleteButton.classList.add("card__delete-button_hidden");
  }

  deleteButton.addEventListener("click", function () {
    deletePopup.dataset.cardId = cardData._id;
    openModalCallback(deletePopup);
  });

  formElementDeleteCard.addEventListener("submit", function (evt) {
    evt.preventDefault();

    const cardId = deletePopup.dataset.cardId;
    deleteCardCallback(cardId)
      .then(() => {
        const cardToRemove = document.querySelector(`[data-id="${cardId}"]`);
        if (cardToRemove) {
          cardToRemove.remove();
        }
        closeModalCallback(deletePopup);
      })
      .catch((error) => {
        console.log("Не удалось удалить карточку", error);
      });
  });

  if (
    cardData.likes.some((likePerson) => {
      return likePerson._id === userData._id;
    })
  ) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", function () {
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );

    toggleLikeCardCallback(cardData._id, isLiked)
      .then((newCardData) => {
        likeNumber.textContent = newCardData.likes.length;
        likeButton.classList.toggle("card__like-button_is-active", !isLiked);
      })
      .catch((error) => {
        console.log("Не удалось поставить лайк", error);
      });
  });

  cardImage.addEventListener("click", function () {
    return ImgPopupCallback(cardData);
  });

  return cardElement;
};
