import "../pages/index.css";
// import { initialCards } from "./cards.js";
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

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const ImgPopup = function (cardData) {
  imgPopup.src = cardData.link;
  imgPopup.alt = cardData.name;
  captionPopup.textContent = cardData.name;
  openModal(typeImgPopup);
};

const callbacks = {
  openModalCallback: openModal,
  closeModalCallback: closeModal,
  ImgPopupCallback: ImgPopup,
  toggleLikeCardCallback: toggleLikeCard,
  deleteCardCallback: deleteCard,
};

const renderResult = function (userData, cardsData) {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileImage.style.backgroundImage = `url(${userData.avatar})`;

  cardsData.forEach(function (cardData) {
    const card = createCard(userData, cardData, callbacks);
    cardList.append(card);
  });
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

const popupArr = [
  editPopup,
  newCardPopup,
  typeImgPopup,
  deletePopup,
  avatarPopup,
];
popupArr.forEach((el) => {
  handleCloseModal(el);
});

const renderLoading = function (isLoading) {
  const submitButton = document.querySelector(config.submitButtonSelector);
  if (isLoading) {
    submitButton.textContent = "Сохранение...";
  } else {
    submitButton.textContent = "Сохранить";
  }
};

const updateProfile = function (userData) {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
};

const handleProfileSubmit = function (evt) {
  evt.preventDefault();
  renderLoading(true);

  const newUserData = {
    name: nameInput.value,
    about: jobInput.value,
  };

  editProfile(newUserData)
    .then((userData) => {
      updateProfile(userData);
    })
    .catch((err) => {
      console.log("Ошибка. Запрос не выполнен:", err);
    })
    .finally(() => renderLoading(false));

  closeModal(editPopup);
};

formElementEditProfile.addEventListener("submit", handleProfileSubmit);

const handleCardSubmit = function (evt) {
  evt.preventDefault();
  renderLoading(true);

  const newCardData = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };

  const newCard = addNewCard(newCardData)
    .then((cardData) => {
      createCard(cardData.owner, cardData, callbacks);
    })
    .catch((err) => {
      console.log("Ошибка. Запрос не выполнен:", err);
    })
    .finally(() => renderLoading(false));

  cardList.prepend(newCard);
  formElementNewCard.reset();
  closeModal(newCardPopup);
};

formElementNewCard.addEventListener("submit", handleCardSubmit);

const updateAvatar = function (userData) {
  profileImage.style.backgroundImage = userData.avatar;
};

const handleAvatarSubmit = function (evt) {
  evt.preventDefault();
  renderLoading(true);

  const newAvatar = {
    avatar: avatarUrlInput.value,
  };

  editAvatar(newAvatar.avatar)
    .then((userData) => {
      updateAvatar(userData);
    })
    .catch((err) => {
      console.log("Ошибка. Запрос не выполнен:", err);
    })
    .finally(() => renderLoading(false));

  formElementNewAvatar.reset();
  closeModal(avatarPopup);
};

formElementNewAvatar.addEventListener("submit", handleAvatarSubmit);

enableValidation(config);

Array.from(document.querySelectorAll(".popup")).forEach((el) => {
  el.classList.add("popup_is-animated");
});
