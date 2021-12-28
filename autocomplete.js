

// reusable autocomplete function that accepts config object to render functional autocomplete widget
// required config object contents (createAutoComplete):
// root : where to render autocomplete to on page
// renderOption: how to display individual list items HTML
// onOptionSelect: what ahppens when list item is clicked
// inputValue: what to fill search input with for follow up api request
// fetchData: how to fetch list data from api 

const createAutoComplete = ({root,renderOption,onOptionSelect,inputValue,fetchData})=>{

// getting selected dom information from root element within config object
     root.innerHTML = `
      <label ><b>Search</b></label>
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
      const items = await fetchData(event.target.value);
    
      if(!items.length){
        dropdown.classList.remove('is-active')
        return
      }
    
      resultsWrapper.innerHTML = '';
    
      dropdown.classList.add('is-active');
    
    
      // looping of data returned from api and rendering results
      for (let item of items) {


        const option = document.createElement('a');
        option.classList.add('dropdown-item');

        // renderOption function decides html for each option item look like
        option.innerHTML = renderOption(item);
    
        // when menu option clicked , close menu and follow up api request with new value
        option.addEventListener('click',e=>{
          input.value = inputValue(item)
          dropdown.classList.remove('is-active')
    
          // followup API request with item id
          onOptionSelect(item)
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