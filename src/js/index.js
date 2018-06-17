import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
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
            state.recipe.parseIngredients();

            //5) Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //6) Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch(error){
            alert("Error Processing the recipe");
        }
    }

};

/** LIST CONTROLLER */

const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient in the list and render it on screen
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    });
}

/** LIKES CONTROLLER */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has NOT liked the current recipe
    if(!state.likes.isLiked(currentID)){
        //Add to the state.likes
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to the UI
        likesView.renderLike(newLike);
        
    //User HAS liked the current recipe
    } else {
        //Remove to the state.likes
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like from the UI
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

/** EVENT LISTENERS */
//Restore liked recipe when page loads
window.addEventListener("load", () => {
    state.likes = new Likes();
    // Restore likes
    state.likes.readStorage();

    //Toggle Button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render existing likes;
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//When the search form is submitted
elements.searchForm.addEventListener("submit", event => {
    event.preventDefault();
    controlSearch();
});

//When there is a hashchange
//window.addEventListener("hashchange", controlRecipe);
//window.addEventListener("load", controlRecipe);
["hashchange","load"].forEach(event => window.addEventListener(event, controlRecipe));

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


//Handles all events in the recipe section
//When servings is either decreased or increased
elements.recipe.addEventListener("click", event => {
    if(event.target.matches(".btn-decrease, .btn-decrease *")){
        //Decrease button is clicked
        if(state.recipe.servings > 1 ){
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(event.target.matches(".btn-increase, .btn-increase *")){
        //Increase button is clicked
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    } else if(event.target.matches(".recipe__btn--add, .recipe__btn--add *")){
        //Add ingredients to the shopping list
        controlList();
    } else if(event.target.matches(".recipe__love, .recipe__love *")){
        //Like controller
        controlLike();
    }
});


//Handles all events in the list section
elements.shopping.addEventListener("click", event => {
    const id = event.target.closest(".shopping__item").dataset.itemid;

    //handle delete
    if (event.target.matches(".shopping__delete, .shopping__delete *")) {
        //delete from state
        state.list.deleteItem(id);

        //delete from user interface
        listView.deleteItem(id);
    } 
    //handle the count update
    else if (event.target.matches(".shopping__count-value")){
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id, val);
    }
});