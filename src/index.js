import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY_API = '28048019-183967a3cd32f0dfa8a2bcd0a';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', searchImages);

const optionsQuery = {
  baseURL: `${BASE_URL}`,
  params: {
    key: `${KEY_API}`,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: `${page}`,
    per_page: 40,
  },
};

function searchImages(event) {
  event.preventDefault();
  optionsQuery.params.q = event.target.elements.searchQuery.value;

  gallery.innerHTML = '';

  createGalleryMarkup();
}

async function getDataFromAPI() {
  const res = await axios(optionsQuery).then(res => res.data.hits);
  return res;
}

function createGaleryItemMarkup(
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads
) {
  return `<a class="gallery__link" href="${largeImageURL}">
    <div class="photo-card">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                 ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${downloads}
            </p>
        </div>
    </div>
  </a>`;
}

function createGalleryMarkup() {
  getDataFromAPI().then(res => {
    const galleryMarkup = res
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          createGaleryItemMarkup(
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads
          )
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    let lightbox = new SimpleLightbox('.gallery a');
  });
}
