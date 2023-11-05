import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

const toggleLoader = showLoader => {
  loader.style.display = showLoader ? 'block' : 'none';
  breedSelect.style.display = !showLoader ? 'block' : 'none';
  catInfo.style.display = !showLoader ? 'block' : 'none';
};

const clearBreedSelect = () => {
  breedSelect.innerHTML = '';
};

const updateBreedSelect = breeds => {
  clearBreedSelect();
  breeds.forEach(breed => {
    breedSelect.innerHTML += `<option value="${breed.id}">${breed.name}</option>`;
  });
};

const updateBreedsList = async () => {
  toggleLoader(true);
  try {
    const breeds = await fetchBreeds();
    updateBreedSelect(breeds);
  } catch (e) {
    error.style.display = 'block';
  } finally {
    toggleLoader(false);
  }
};

window.addEventListener('load', updateBreedsList);

breedSelect.addEventListener('change', async () => {
  const selectedBreedId = breedSelect.value;
  toggleLoader(true);
  try {
    const cat = await fetchCatByBreed(selectedBreedId);

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
  } catch (e) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  } finally {
    toggleLoader(false);
  }
});
