const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-42",
  headers: {
    authorization: "4d8cfa9b-6c0c-4de7-a208-d1764c44398d",
    "Content-Type": "application/json",
  },
};

const checkResponse = function (res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
};

export const getUserInfo = function () {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(checkResponse);
};

export const getInitialCards = function () {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(checkResponse);
};

export const editProfile = function (newUserData) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: newUserData.name,
      about: newUserData.about,
    }),
  }).then(checkResponse);
};

export const addNewCard = function (newCardData) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: newCardData.name,
      link: newCardData.link,
    }),
  }).then(checkResponse);
};

export const deleteCard = function (cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
};

export const toggleLikeCard = function (cardId, isLiked) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  }).then(checkResponse);
};

export const editAvatar = function (newAvatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: newAvatarUrl,
    }),
  }).then(checkResponse);
};
