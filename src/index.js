import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY_API = '28048019-183967a3cd32f0dfa8a2bcd0a';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let totalHits = 0;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const buttonLoadMore = document.querySelector('.load-more');

form.addEventListener('submit', searchImages);
buttonLoadMore.addEventListener('click', loadMore);

const optionsQuery = {
  baseURL: `${BASE_URL}`,
  params: {
    key: `${KEY_API}`,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

function searchImages(event) {
  event.preventDefault();
  buttonLoadMore.classList.add('is-hidden');
  optionsQuery.params.page = 1;
  optionsQuery.params.q = event.target.elements.searchQuery.value;

  gallery.innerHTML = '';

  createGalleryMarkup();
}

async function getDataFromAPI() {
  const res = await axios(optionsQuery).then(res => res.data);

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
    const galleryMarkup = res.hits
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

    if (galleryMarkup.length !== 0) {
      gallery.insertAdjacentHTML('beforeend', galleryMarkup);

      buttonLoadMore.classList.remove('is-hidden');

      infoOfSearchResult(res.totalHits);
      infoOfEnd(res.totalHits);

      let lightbox = new SimpleLightbox('.gallery a');
    } else {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`,
        {
          timeout: 6000,
        }
      );
    }
  });
}

function loadMore() {
  optionsQuery.params.page += 1;

  createGalleryMarkup();
}

function infoOfEnd(totalHits) {
  page = optionsQuery.params.page;
  const countImagesPerPage = optionsQuery.params.per_page;
  const countImages = page * countImagesPerPage;

  if (countImages > totalHits) {
    buttonLoadMore.classList.add('is-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        timeout: 6000,
      }
    );
  }
}

function infoOfSearchResult(totalHits) {
  if (optionsQuery.params.page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {
      timeout: 6000,
    });
  }
}
