export const createCard = function (
  userData,
  cardData,
  {
    handleDeleteButtonCallback,
    toggleLikeCardCallback,
    handleOpenImgPopupCallback,
  }
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeNumber = cardElement.querySelector(".card__like-number");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  likeNumber.textContent = cardData.likes.length;

  if (userData._id !== cardData.owner._id) {
    deleteButton.classList.add("card__delete-button_hidden");
  }

  deleteButton.addEventListener("click", function () {
    handleDeleteButtonCallback(cardElement, cardData._id);
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
    return handleOpenImgPopupCallback(cardData);
  });

  return cardElement;
};
