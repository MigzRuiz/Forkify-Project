import axios from "axios";

async function getSearchResults(query){
    try {
        const PROXY_URL="https://cors-anywhere.herokuapp.com/";
        const API_KEY="65da4a380a02109c13bc67ca92df4e73";

        const result = await axios(`${PROXY_URL}http://food2fork.com/api/search?key=${API_KEY}&q=${query}`);
        const recipe = result.data.recipes;
        console.log(recipe);
    } catch(error) {
        alert(error);
    }

}

getSearchResults("adobo");