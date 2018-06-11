import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import {elements, renderLoader, clearLoader/*, renderButtons*/} from "./views/base";

/* Global State of the app
    - Search Object
    - Current Recipe Object
    - Shopping List Object
    - Liked Recipes
*/
const state = {};

/** SEARCH CONTROLLER */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
        //console.log(query);

    //If query is not empty
    if(query) {
        // 2) Create a new search object and add it to state
        state.search = new Search(query);  
        
        // 3) Prep UI = clear previous input, clear previous, loader
        searchView.clearInput();            
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for the recipes
            await state.search.getResults(); //Await because the results of getResults is a promise and will need fetch from the server first. EVERY ASYNC FUNCTION returns a promise

            // 5) Render result on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error){
            alert("Error Processing the recipe");
        }
    }
}

/** RECIPE CONTROLLER */
const controlRecipe = async () => {
    //1) Get ID from the URL
    const id = window.location.hash.replace("#", "");

    if(id) {
        //2) Create a new recipe object
        state.recipe = new Recipe(id);

        //Highlight Selected Search Item;
        if(state.search) searchView.highlightSelected(id);

        //3) Prepare the UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
    
        try {
            //4) Get recipe data and parseIngredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //5) Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //6) Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(error){
            alert("Error Processing the recipe");
        }
    }

};

/** LIST CONTROLLER */

window.l = new List();

/** EVENT LISTENERS */
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
});

//When there is a hashchange
//window.addEventListener("hashchange", controlRecipe);
//window.addEventListener("load", controlRecipe);
["hashchange","load"].forEach(event => window.addEventListener(event, controlRecipe));


