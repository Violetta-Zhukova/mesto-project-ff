import "../pages/index.css";
import { initialCards } from "./cards.js";
import { deleteCard, createCard, likeCard } from "./card.js";
import { openModal, closeModal, handleCloseModal } from "./modal.js";

const content = document.querySelector(".content");
const cardList = content.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const typeImgPopup = document.querySelector(".popup_type_image");
const imgPopup = typeImgPopup.querySelector(".popup__image");
const captionPopup = typeImgPopup.querySelector(".popup__caption");

const formElementEditProfile = editPopup.querySelector(".popup__form");
const nameInput = formElementEditProfile.querySelector(
  ".popup__input_type_name"
);
const jobInput = formElementEditProfile.querySelector(
  ".popup__input_type_description"
);
const profileTitle = content.querySelector(".profile__title");
const profileDescription = content.querySelector(".profile__description");

const formElementNewCard = newCardPopup.querySelector(".popup__form");
const cardNameInput = formElementNewCard.querySelector(
  ".popup__input_type_card-name"
);
const cardUrlInput = formElementNewCard.querySelector(".popup__input_type_url");

Array.from(document.querySelectorAll(".popup")).forEach((el) => {
  el.classList.add("popup_is-animated");
});

const handleImgPopup = function (imgValue, titleValue) {
  imgPopup.src = imgValue;
  imgPopup.alt = titleValue;
  captionPopup.textContent = titleValue;
  openModal(typeImgPopup);
};

initialCards.forEach(function (element) {
  const card = createCard(
    element.link,
    element.name,
    deleteCard,
    handleImgPopup,
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

const popupArr = [editPopup, newCardPopup, typeImgPopup];
popupArr.forEach((el) => {
  handleCloseModal(el);
});

const handleProfileSubmit = function (evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(editPopup);
};

formElementEditProfile.addEventListener("submit", handleProfileSubmit);

const handleCardSubmit = function (evt) {
  evt.preventDefault();

  const newCard = createCard(
    cardUrlInput.value,
    cardNameInput.value,
    deleteCard,
    handleImgPopup,
    likeCard
  );
  cardList.prepend(newCard);

  formElementNewCard.reset();
  closeModal(newCardPopup);
};

formElementNewCard.addEventListener("submit", handleCardSubmit);
