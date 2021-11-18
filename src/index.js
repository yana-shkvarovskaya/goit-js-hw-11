// import { Notify } from 'notiflix';
import './css/styles.css';
import  ImagesApiService from './js/image-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a');


function onSearch(e) {
  e.preventDefault();

  clearImagesContainer();
  imagesApiService.query = e.currentTarget.elements.query.value;

  if (!imagesApiService.query ) 
  return ;
  
  imagesApiService.fetchImages()
  .then(data => {
      if (data.total === 0){
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        return;
      }
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      appendHitsMarkup(data.hits);
      // smoothScroll();
      lightbox.refresh();
      refs.loadMoreBtn.classList.remove('visually-hidden');
      lastPageOfResults(data.totalHits);
  });
  imagesApiService.resetPage();
//   imagesApiService.fetchImages().then(appendHitsMarkup);
}

function onLoadMore() {
    imagesApiService.fetchImages()
    .then(data => {
        appendHitsMarkup(data.hits);
        lightbox.refresh();
        smoothScroll ()
    });
}

function appendHitsMarkup (data) {
    const markup = data
    .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `<a class='gallery__item' href="${largeImageURL}">
      <img class='gallery__image' src="${webformatURL}" alt="${tags}" title=""/>
    <div class="gallery__info">
    <p class="gallery__description">
      <b>Likes</b>
      <span class ="gallery__value">${likes}</span>
    </p>
    <p class="gallery__description">
      <b>Views</b>
      <span class ="gallery__value">${views}</span>
    </p>
    <p class="gallery__description">
      <b>Comments</b>
      <span class ="gallery__value">${comments}</span>
    </p>
    <p class="gallery__description">
      <b>Downloads</b>
      <span class ="gallery__value">${downloads}</span>
    </p>
</div></a>`;
    })
    .join('');

    refs.imagesContainer.insertAdjacentHTML('beforeend', markup)
}

function clearImagesContainer(){
  refs.loadMoreBtn.classList.add('visually-hidden');
    refs.imagesContainer.innerHTML = "";
}

function lastPageOfResults () {
  imagesApiService.fetchImage().then(resp => {
    if(resp.length < 12) {
      Notify.failure(`"We're sorry, 
      but you've reached the end of search results."`)
    }
    })

  };


function smoothScroll () {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 12,
  behavior: "smooth",
});
}