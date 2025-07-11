import "../pages/index.css";
import { createCard } from "./card.js";
import { openModal, closeModal, handleCloseModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getUserInfo,
  getInitialCards,
  editProfile,
  addNewCard,
  deleteCard,
  toggleLikeCard,
  editAvatar,
} from "./api.js";

const content = document.querySelector(".content");
const cardList = content.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const typeImgPopup = document.querySelector(".popup_type_image");
const imgPopup = typeImgPopup.querySelector(".popup__image");
const captionPopup = typeImgPopup.querySelector(".popup__caption");
const deletePopup = document.querySelector(".popup_type_delete");
const formElementDeleteCard = deletePopup.querySelector(".popup__form");
const avatarPopup = document.querySelector(".popup_type_new-avatar");

const formElementEditProfile = editPopup.querySelector(".popup__form");
const nameInput = formElementEditProfile.querySelector(
  ".popup__input_type_name"
);
const jobInput = formElementEditProfile.querySelector(
  ".popup__input_type_description"
);
const profileTitle = content.querySelector(".profile__title");
const profileDescription = content.querySelector(".profile__description");
const profileImage = content.querySelector(".profile__image");

const formElementNewCard = newCardPopup.querySelector(".popup__form");
const cardNameInput = formElementNewCard.querySelector(
  ".popup__input_type_card-name"
);
const cardUrlInput = formElementNewCard.querySelector(".popup__input_type_url");

const formElementNewAvatar = avatarPopup.querySelector(".popup__form");
const avatarUrlInput = formElementNewAvatar.querySelector(
  ".popup__input_type_avatar-url"
);

let currentCardElement;
let currentCardId;

const popupArr = [
  editPopup,
  newCardPopup,
  typeImgPopup,
  deletePopup,
  avatarPopup,
];

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const handleOpenImgPopup = function (cardData) {
  imgPopup.src = cardData.link;
  imgPopup.alt = cardData.name;
  captionPopup.textContent = cardData.name;
  openModal(typeImgPopup);
};

const renderLoading = function (isLoading, buttonElement) {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
  } else {
    buttonElement.textContent = "Сохранить";
  }
};

const updateProfile = function (userData) {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
};

const handleProfileSubmit = function (evt) {
  evt.preventDefault();
  renderLoading(true, evt.submitter);

  const newUserData = {
    name: nameInput.value,
    about: jobInput.value,
  };

  editProfile(newUserData)
    .then((userData) => {
      updateProfile(userData);
      closeModal(editPopup);
    })
    .catch((err) => {
      console.log("Ошибка. Запрос не выполнен:", err);
    })
    .finally(() => renderLoading(false, evt.submitter));
};

const handleCardSubmit = function (evt) {
  evt.preventDefault();
  renderLoading(true, evt.submitter);

  const newCardData = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };

  addNewCard(newCardData)
    .then((cardData) => {
      cardList.prepend(createCard(cardData.owner, cardData, callbacks));
      formElementNewCard.reset();
      closeModal(newCardPopup);
    })
    .catch((err) => {
      console.log("Ошибка. Запрос не выполнен:", err);
    })
    .finally(() => renderLoading(false, evt.submitter));
};

const handleDeleteButton = function (cardElement, cardDataId) {
  currentCardElement = cardElement;
  currentCardId = cardDataId;
  openModal(deletePopup);
};

const handleDeleteCard = function (evt, cardElement, cardDataId) {
  evt.preventDefault();

  deleteCard(cardDataId)
    .then(() => {
      cardElement.remove();
      closeModal(deletePopup);
      currentCardElement = null;
      currentCardId = null;
    })
    .catch((error) => {
      console.log("Не удалось удалить карточку", error);
    });
};

const handleLikeCard = function (cardDataId, likeElement, likeNumber) {
  const isLiked = likeElement.classList.contains("card__like-button_is-active");

  toggleLikeCard(cardDataId, isLiked)
    .then((newCardData) => {
      likeNumber.textContent = newCardData.likes.length;
      likeElement.classList.toggle("card__like-button_is-active", !isLiked);
    })
    .catch((error) => {
      console.log("Не удалось поставить лайк", error);
    });
};

const updateAvatar = function (userData) {
  profileImage.style.backgroundImage = `url('${userData.avatar}')`;
};

const handleAvatarSubmit = function (evt) {
  evt.preventDefault();
  renderLoading(true, evt.submitter);

  editAvatar(avatarUrlInput.value)
    .then((userData) => {
      updateAvatar(userData);
      formElementNewAvatar.reset();
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.log("Ошибка. Запрос не выполнен:", err);
    })
    .finally(() => renderLoading(false, evt.submitter));
};

const callbacks = {
  handleDeleteButtonCallback: handleDeleteButton,
  handleLikeCardCallback: handleLikeCard,
  handleOpenImgPopupCallback: handleOpenImgPopup,
};

const renderResult = function (userData, cardsData) {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileImage.style.backgroundImage = `url(${userData.avatar})`;

  cardsData.forEach(function (cardData) {
    const card = createCard(userData, cardData, callbacks);
    cardList.append(card);
  });
  console.log(cardsData);
};

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    return renderResult(userData, cardsData);
  })
  .catch((err) => {
    console.log("Ошибка. Запрос не выполнен:", err);
  });

editButton.addEventListener("click", function () {
  openModal(editPopup);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formElementEditProfile, config);
});

addButton.addEventListener("click", function () {
  openModal(newCardPopup);
  formElementNewCard.reset();
  clearValidation(formElementNewCard, config);
});

profileImage.addEventListener("click", function () {
  openModal(avatarPopup);
  formElementNewAvatar.reset();
  clearValidation(formElementNewAvatar, config);
});

popupArr.forEach((el) => {
  handleCloseModal(el);
});

enableValidation(config);

Array.from(document.querySelectorAll(".popup")).forEach((el) => {
  el.classList.add("popup_is-animated");
});

formElementEditProfile.addEventListener("submit", handleProfileSubmit);
formElementNewCard.addEventListener("submit", handleCardSubmit);
formElementDeleteCard.addEventListener("submit", function (evt) {
  handleDeleteCard(evt, currentCardElement, currentCardId);
});
formElementNewAvatar.addEventListener("submit", handleAvatarSubmit);
