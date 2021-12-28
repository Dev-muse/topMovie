

// reusable autocomplete function that accepts config object to render functional autocomplete widget


const createAutoComplete = ({root,renderOption})=>{

// getting selected dom information from root element within config object
     root.innerHTML = `
      <label ><b>Search For a Movie</b></label>
      <input class="input"/>
      <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
    `;
    
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    


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
        option.classList.add('dropdown-item');

        // renderOption function decides what option items look like
        option.innerHTML = renderOption(movie);
    
        // detecting individual option clicked , close menu and follow up api request with new value
        option.addEventListener('click',e=>{
          input.value = movie.Title
          dropdown.classList.remove('is-active')
    
          // followup API request with movie id
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
}