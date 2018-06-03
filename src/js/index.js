import Search from "./models/Search";
import * as searchView from "./views/searchView";
import {elements, renderLoader, clearLoader, renderButtons} from "./views/base";

/* Global State of the app
    - Search Object
    - Current recipt Object
    - Shopping list Object
    - Liked Recipes
*/
const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    console.log(query);

    //If query is not empty
    if(query) {
        // 2) Create a new search object and add it to state
        state.search = new Search(query);

        // 3) Prep UI = clear previous input, clear previous, loader
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for the recipes
        await state.search.getResults(); //Await because the results of getResults is a promise and will need fetch from the server first. EVERY ASYNC FUNCTION returns a promise

        // 5) Render result on the UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

//When the search form is submitted
elements.searchForm.addEventListener("submit", event => {
    event.preventDefault();
    controlSearch();

});

//When next/prev page is clicked
elements.searchResPages.addEventListener("click", event => {
    const btn = event.target.closest(".btn-inline");
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10); //base10

        //Clear the results first
        searchView.clearInput();
        searchView.clearResults();
        
        searchView.renderResults(state.search.result, goToPage); //Go to specific page
    }
})