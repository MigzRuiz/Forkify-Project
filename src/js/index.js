import Search from "./models/Search";

/* Global State of the app
    - Search Object
    - Current recipt Object
    - Shopping list Object
    - Liked Recipes
*/
const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = "pizza" //TODO

    //If query is not empty
    if(query) {
        // 2) Create a new search object and add it to state
        state.search = new Search(query);

        // 3) Prep UI
            //TODO
        
        // 4) Search for the recipes
        await state.search.getResults(); //Await because the results of getResults is a promise and will need fetch from the server first. EVERY ASYNC FUNCTION returns a promise

        // 5) Render result on the UI
        console.log(state.search.result);
    } 

}

document.querySelector(".search").addEventListener("submit", event => {
    event.preventDefault();
    controlSearch();
});



