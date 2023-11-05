import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function toggleLoader(showLoader) {
  if (showLoader) {
    loader.style.display = 'block';
    breedSelect.style.display = 'none';
    catInfo.style.display = 'none';
  } else {
    loader.style.display = 'none';
    breedSelect.style.display = 'block';
    catInfo.style.display = 'block';
  }
}

function clearBreedSelect() {
  breedSelect.innerHTML = '';
}

function updateBreedSelect(breeds) {
  clearBreedSelect();
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

function updateBreedsList() {
  toggleLoader(true);
  fetchBreeds()
    .then(breeds => {
      updateBreedSelect(breeds);
      toggleLoader(false);
    })
    .catch(() => {
      error.style.display = 'block';
      toggleLoader(false);
    });
}

window.addEventListener('load', updateBreedsList);

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;
  toggleLoader(true);
  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      const catImage = document.createElement('img');
      catImage.src = cat.url;
      catImage.alt = 'Cat Image';
      catImage.style.width = '300px';
      catImage.style.height = 'auto';

      const breedName = document.createElement('h2');
      breedName.textContent = cat.breeds[0].name;

      const description = document.createElement('p');
      description.textContent = cat.breeds[0].description;

      const temperament = document.createElement('p');
      temperament.textContent = cat.breeds[0].temperament;

      catInfo.innerHTML = '';
      catInfo.appendChild(catImage);
      catInfo.appendChild(breedName);
      catInfo.appendChild(description);
      catInfo.appendChild(temperament);

      toggleLoader(false);
    })
    // .catch(() => {
    //   error.style.display = 'block';
    //   toggleLoader(false);
    // });

    .catch(() => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      toggleLoader(false);
    });
});
