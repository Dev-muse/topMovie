const fetchData = async searchTerm => {
  const {data} = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      s: searchTerm
    }
  });

  if (data.Error) {
    return [];
  }

  return data.Search;
};

 

const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label for="input"><b>Search For a Movie</b></label>
  <input class="input" id="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async event => {
  const movies = await fetchData(event.target.value);

  if(!movies.length){
    dropdown.classList.remove('is-active')
    return
  }

  resultsWrapper.innerHTML = '';

  dropdown.classList.add('is-active');


  // looping of data returned from api and rendering results
  for (let movie of movies) {
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.classList.add('dropdown-item');
    option.innerHTML = `
      <img src="${imgSrc}" alt="${movie.Title}"/>
      ${movie.Title}
    `;

    // detecting individual menu item clicked , close menu & placing title in search input
    option.addEventListener('click',e=>{
      input.value = movie.Title
      dropdown.classList.remove('is-active')

      // followup request with movie id
      onMovieSelect(movie)
    })

    resultsWrapper.appendChild(option);
  }
};

// call api on search and render data
input.addEventListener('input', debounce(onInput, 500));


// add event listener on document,if element clicked outside root element. 
// Event handled and drop down closed

document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active');
  }
});


// helper function for followup request

const onMovieSelect = async ({imdbID})=>{
  const {data} = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: imdbID
    }
  });
  console.log({data})

  document.querySelector('#summary').innerHTML = movieTemplate(data)

};


// helper function to render follow up request data
const movieTemplate = movieDetail =>{
  return `
<article class="card">
  <article class="card-content">
    <article class="media">
      <div class="media-left">
        <figure class="image is-128x128">
          <img src="${movieDetail.Poster}" alt="${movieDetail.Title}">
        </figure>
      </div>
      <div class="media-content">
        <h1 class="title is-4">${movieDetail.Title}</h1>
        <p class="subtitle is-6">${movieDetail.Genre}</p>
        <article class="content">
          <p>${movieDetail.Plot}</p>
        </article>
      </div>
    </article>

    <article class="notification is-link">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-link">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-link">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-link">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-link">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  </article>
</article>
  `
}