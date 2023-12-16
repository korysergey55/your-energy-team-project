import iziToast from 'izitoast';
import { getExerciseById } from './api/api';
import { loader } from './utils/loader';
import { FavoritesStorage } from './favorites/FavoritesStorage';
import { FAVORITES_STORAGE_KEY } from './favorites/favoritesConfig';

// const cardsList = document.querySelector('.cards');
const cardsList = document.querySelector('.js-common-card-list');
const cardFavoritesWrapper = document.querySelector('.js-faovorites-wrapper');

const contentUpdate = document.querySelector('.excercise_units');
const modalExcercise = document.querySelector('.modal_window_container');
const closeModalButton = document.querySelector('.close_modal_button');
const giveRatingButton = document.querySelector('.rate_button');
const overflow = document.body;
// const addFavoriteBtn = document.querySelector(".add_favorite_button");
const addFavoriteBtn = document.querySelector('.js-add-favorite-btn');
const excerciseName = document.querySelector('.modal_title');
const excerciseRating = document.querySelector('.excercise_rating');
const star = document.querySelectorAll('.star_item');
const image = document.querySelector('.modal_image');
let cardState = null;
const storage = new FavoritesStorage(FAVORITES_STORAGE_KEY);

if (cardsList) {
  cardsList.addEventListener('click', openModal);
}

if (cardFavoritesWrapper) {
  cardFavoritesWrapper.addEventListener('click', openModal);
}

closeModalButton.addEventListener('click', clickToClose);
giveRatingButton.addEventListener('click', openRateModal);
addFavoriteBtn.addEventListener('click', addFavoriteAction);

function buttonView(cardId) {
  if (storage.isCardExisted(cardId)) {
    addFavoriteBtn.classList.add('is-card-existed');
  } else {
    addFavoriteBtn.classList.remove('is-card-existed');
  }
}

function addFavoriteAction() {
  if (!cardState) return;

  if (storage.isCardExisted(cardState._id)) {
    storage.removeCard(cardState._id);
    buttonView(cardState._id);
    // addFavoriteBtn.classList.add('is-card-existed');
  } else {
    storage.addCard(cardState);
    buttonView(cardState._id);
    // addFavoriteBtn.classList.remove('is-card-existed');
  }
}

// function showIcon() {
//         let trashIcon = document.querySelector(".trash")
// let heartIcon = document.querySelector(".heart")
// trashIcon.classList.toggle("hidden-icon")
// heartIcon.classList.toggle("hidden-icon")
// addFavoriteBtn.classList.toggle("button-text")
// if (addFavoriteBtn.classList.contains("button-text"))
// {
//             } else {addFavoriteBtn.textContent = `Remove from Favorite `}
// }

function editName(elem) {
  if (elem === null || undefined) {
    return;
  } else {
    excerciseName.textContent = elem;
  }
}

function editRating(rating) {
  if (rating === null || undefined) {
    return;
  } else {
    let newRating = rating.toFixed(1);
    excerciseRating.textContent = newRating;
  }
}

function colorizeStars(rating) {
  let firstStar = document.querySelector('.first_star');
  let secondStar = document.querySelector('.second_star');
  let thirdStar = document.querySelector('.third_star');
  let fourthStar = document.querySelector('.fourth_star');
  let fifthStar = document.querySelector('.fifth_star');
  if (rating === 5) {
    firstStar.classList.add('rating_star_filled');
    secondStar.classList.add('rating_star_filled');
    thirdStar.classList.add('rating_star_filled');
    fourthStar.classList.add('rating_star_filled');
    fifthStar.classList.add('rating_star_filled');
  } else if (rating >= 4) {
    firstStar.classList.add('rating_star_filled');
    secondStar.classList.add('rating_star_filled');
    thirdStar.classList.add('rating_star_filled');
    fourthStar.classList.add('rating_star_filled');
  } else if (rating >= 3) {
    firstStar.classList.add('rating_star_filled');
    secondStar.classList.add('rating_star_filled');
    thirdStar.classList.add('rating_star_filled');
  } else if (rating >= 2) {
    firstStar.classList.add('rating_star_filled');
    secondStar.classList.add('rating_star_filled');
  } else if (rating >= 1) {
    firstStar.classList.add('rating_star_filled');
  } else {
    return;
  }
}

function updateImage(imgUrl, alt) {
  if (imgUrl === null || undefined) {
    return;
  } else {
    image.src = imgUrl;
    image.alt = alt;
  }
}

function markupModal({
  time,
  bodyPart,
  equipment,
  target,
  description,
  burnedCalories,
  popularity,
}) {
  return `<li class="excercise_item"><h4 class="excercise_title">Taget</h4><p class="excercise_text">${target}</p></li>
<li class="excercise_item"><h4 class="excercise_title">Body Part</h4>
        <p class="excercise_text">${bodyPart}</p></li>
 <li class="excercise_item"><h4 class="excercise_title">Equipment</h4>
        <p class="excercise_text">${equipment}</p></li>
        <li class="excercise_item"><h4 class="excercise_title">Popular</h4>
        <p class="excercise_text">${popularity}</p></li>
        <li class="excercise_item"><h4 class="excercise_title">Burned calories</h4>
        <p class="excercise_text">${burnedCalories}/${time} min</p></li>
        <p class="modal_text">${description}</p>
`;
}

function openRateModal() {
  giveRatingButton.classList.remove('is-hidden');
  modalExcercise.classList.add('is-hidden');
  window.removeEventListener('keydown', closeModal);
  window.removeEventListener('click', closeModal);
}

function openModal(e) {
  const btn = e.target.closest('.js-excercise-button');
  if (!btn) return;

  // const card = btn.closest('.exercises-item');

  const card = btn.closest('.js-common-card-item');

  const cardId = card.dataset.exerciseId;

  loader.create();

  getExerciseById(cardId)
    .then(resp => {
      const modalMarkup = markupModal(resp);
      contentUpdate.innerHTML = modalMarkup;
      editName(resp.name);
      editRating(resp.rating);
      colorizeStars(resp.rating);
      updateImage(resp.gifUrl, resp.name);
      cardState = resp;
      console.log(resp);

      buttonView(resp._id);
    })
    .catch(err => {
      console.error(err);
      iziToast.show({
        position: 'center',
        color: 'red',
        message: 'An error has ocurred. Please try again later',
      });
    })
    .finally(() => {
      loader.destroy();
    });
  giveRatingButton.setAttribute('data-Id', cardId);

  modalExcercise.classList.remove('is-hidden');
  overflow.style.overflow = 'hidden';
  window.addEventListener('keydown', closeModal);
  window.addEventListener('click', closeModal);
}

function closeModal(event) {
  if (event.key === 'Escape') {
    modalExcercise.classList.add('is-hidden');
    overflow.style.overflow = 'visible';
  } else if (
    !event.target.closest('.modal_window_default_content,.js-excercise-button')
  ) {
    modalExcercise.classList.add('is-hidden');
    overflow.style.overflow = 'visible';
  }
}

function clickToClose() {
  modalExcercise.classList.add('is-hidden');
  overflow.style.overflow = 'visible';
}
