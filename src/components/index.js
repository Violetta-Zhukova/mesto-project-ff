import "../pages/index.css";
import { initialCards } from "./cards.js";
import { deleteCard, addCard, likeCard } from "./card.js";
import { openModal, closeModal, handleCloseModal } from "./modal.js";

const content = document.querySelector(".content");
const cardList = content.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const typeImgPopup = document.querySelector(".popup_type_image");

const formElement = editPopup.querySelector(".popup__form");
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");
const profileTitle = content.querySelector(".profile__title");
const profileDescription = content.querySelector(".profile__description");

const formElementNewCard = newCardPopup.querySelector(".popup__form");
const cardNameInput = formElementNewCard.querySelector(
  ".popup__input_type_card-name"
);
const cardUrlInput = formElementNewCard.querySelector(".popup__input_type_url");

initialCards.forEach(function (element) {
  const card = addCard(
    element.link,
    element.name,
    deleteCard,
    openModal,
    likeCard
  );
  cardList.append(card);
});

editButton.addEventListener("click", function () {
  openModal(editPopup);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
});

addButton.addEventListener("click", function () {
  openModal(newCardPopup);
});

handleCloseModal(editPopup);
handleCloseModal(newCardPopup);
handleCloseModal(typeImgPopup);

const handleFormSubmit = function (evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(editPopup);
};

formElement.addEventListener("submit", handleFormSubmit);

const handleCardSubmit = function (evt) {
  evt.preventDefault();

  const newCard = addCard(
    cardUrlInput.value,
    cardNameInput.value,
    deleteCard,
    openModal,
    likeCard
  );
  cardList.prepend(newCard);

  cardUrlInput.value = "";
  cardNameInput.value = "";
  closeModal(newCardPopup);
};

formElementNewCard.addEventListener("submit", handleCardSubmit);
