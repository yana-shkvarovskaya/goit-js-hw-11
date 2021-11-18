const API_KEY = '24385754-e04213b2da07f3f18967e54df';
const BASE_URL = 'https://pixabay.com/api/';

const axios = require('axios');

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }


  async fetchImages() {
   const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}
   &image_type=photo&orientation=horizontal&safesearch=true
   &page=${this.page}&per_page=${this.per_page}`;

    try {
        const resp = await axios.get(url);
          this.incrementPage();
          return resp.data;
        
        }
          catch (error) {
              return error;
          }
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

    incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

 async fetchImage(){
    try {
      const url2 = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}
      &image_type=photo&orientation=horizontal&safesearch=true
      &page=${this.page}&per_page=${this.per_page}`;
   
      const resp = await axios.get(url2);
      this.incrementPage();
        return resp.data.hits;
        // console.log(resp.data.hits);
      }
        catch (error) {
            return error;
        }
  }

  }

