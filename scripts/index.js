const content = document.querySelector(".content");
const cardList = content.querySelector(".places__list");

function deleteCard(element) {
  element.remove();
}

function addCard(imgValue, titleValue, deleteCard) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = imgValue;
  cardImage.alt = titleValue;
  cardElement.querySelector(".card__title").textContent = titleValue;

  deleteButton.addEventListener("click", function () {
    deleteCard(cardElement);
  });

  return cardElement;
}

initialCards.forEach(function (element) {
  const card = addCard(element.link, element.name, deleteCard);
  cardList.append(card);
});
