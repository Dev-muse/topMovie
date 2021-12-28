
// required config object contents (createAutoComplete):
// root : where to render autocomplete to on page
// renderOption: how to display individual list items HTML
// onOptionSelect: what ahppens when list item is clicked
// inputValue: what to fill search input with for follow up api request
// fetchData: how to fetch list data from api 

 createAutoComplete({
   root: document.querySelector('.autocomplete'),
   renderOption(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" alt="${movie.Title}"/>
    ${movie.Title} (${movie.Year})
    `

   },
   onOptionSelect(movie){
      onMovieSelect(movie)
   },
   inputValue(movie){
     return movie.Title
   },
   async fetchData(searchTerm){
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

   }
 })

 

// helper function for followup API request

const onMovieSelect = async ({imdbID})=>{
  const {data} = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: imdbID
    }
  });
  console.log({data})

  // displaying full movie details here
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