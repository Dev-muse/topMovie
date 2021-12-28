
// required config object contents (createAutoComplete):
// root : where to render autocomplete to on page
// renderOption: how to display individual list items HTML
// onOptionSelect: what ahppens when list item is clicked
// inputValue: what to fill search input with for follow up api request
// fetchData: how to fetch list data from chosen api 


const autoCompleteConfig ={
  renderOption(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" alt="${movie.Title}"/>
    ${movie.Title} (${movie.Year})
    `

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

};

 createAutoComplete({
   ...autoCompleteConfig,
   root: document.querySelector('#left-autocomplete'),
   onOptionSelect(movie){
    //  hide tutorial div on option select
    document.querySelector('.tutorial').classList.add('is-hidden');

    // second api call and render details on dom
    const summaryContainer = document.querySelector('.left-summary');
      onMovieSelect(movie,summaryContainer,'left')
   },
 })

 
 createAutoComplete({
   ...autoCompleteConfig,
   root: document.querySelector('#right-autocomplete'),
   onOptionSelect(movie){
    //  hide tutorial div on option select
    document.querySelector('.tutorial').classList.add('is-hidden');

    // second api call and render summary on dom
    const summaryContainer = document.querySelector('.right-summary');
    
      onMovieSelect(movie,summaryContainer,'right')
   },
 })

 
let leftElement;
let rightElement;
// helper function for followup API request
const onMovieSelect = async (movie,summaryContainer,side)=>{
  const {data} = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  });
  console.log({data})

  // rendering full item details here from template
  summaryContainer.innerHTML = movieTemplate(data)


  
  if(side ==='left'){
    leftElement = data
  }else if (side==='right'){
    rightElement = data
  }

  // check if elements contain data before comparison
  if(leftElement && rightElement){
    runComparison()
  }
};

// helper function to compare data from both sides
const runComparison = ()=>{
  const leftSideStats= document.querySelectorAll('.left-summary .notification')
  const rightSideStats= document.querySelectorAll('.right-summary .notification')

// conpare left and right dom data values and change color
  leftSideStats.forEach((leftStat,index)=>{
    let rightStat = rightSideStats[index]
    
    let rightSideValue = rightStat.dataset.value
    let leftSideValue = leftStat.dataset.value

    if(leftSideValue>rightSideValue){
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
      
    }else{
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')

    }


  })


}


// helper function to render follow up request data
const movieTemplate = movieDetail =>{

  // checking to see if any of the required metrics are missing
if(!movieDetail.BoxOffice || !movieDetail.Metascore || !movieDetail.imdbRating || !movieDetail.imdbVotes || !movieDetail.Awards){
  return `
    <article className="card">
      <article className="content">
        <h1 class="title is-4">Sorry no data for this movie</h1>
      </article>
    </article>
  `
}



console.log(movieDetail)
  // formating comparison metrics
  const boxOffice = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''))
  const metascore = parseInt(movieDetail.Metascore)
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''))

  // suming total awards & nominations per movie not total wins
  const awards = movieDetail.Awards.split(' ').reduce((totalAwards,word)=>{
   let value = parseInt(word)
      if(!value){
        return totalAwards
      }else{
        totalAwards += value
      }   
    return totalAwards
  },0)
  console.log(awards)
 
  return `
<article  class="card">
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

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value=${boxOffice} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>

  </article>
</article>
  `
}