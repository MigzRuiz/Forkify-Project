import Search from "./models/Search";
import * as searchView from "./views/searchView";
import {elements, renderLoader} from "./views/base";

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

        // 3) Prep UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for the recipes
        await state.search.getResults(); //Await because the results of getResults is a promise and will need fetch from the server first. EVERY ASYNC FUNCTION returns a promise

        // 5) Render result on the UI
        //console.log(state.search.result);
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener("submit", event => {
    event.preventDefault();
    controlSearch();

});