import axios from "axios";
import {API_KEY, PROXY_URL} from "../config";

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try {
            const result = await axios(`${PROXY_URL}http://food2fork.com/api/get?key=${API_KEY}&rId=${this.id}`);
            
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;    
        } catch(error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    calcTime(){
        //Assuming that we need 15 mins for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    //We need to parse them as count, unit, ingredient name
    //We also need to standardize the measurement
    parseIngredients() {
        const unitArr = [
            ["tablespoons","tbsp"],
            ["tablespoon","tbsp"],
            ["ounces","oz"],
            ["ounce","oz"],
            ["teaspoons","tsp"],
            ["teaspoon","tsp"],
            ["cups","cup"],
            ["pounds","lbs"],
            ["pound","lb"],
            ["kilogram","kg"],
            ["gram","g"]
        ];

        //Creating a variable to hold the new objects that's gonna be created
        const newIngredients = this.ingredients.map(element => {
            //1) Standardize the units
            const unitMap = new Map(unitArr);
            let ingredient = element.toLowerCase();

            //I need to find a way to convert each of keys to their values. (Ex: teaspoon(key) to tsp(value))
            unitMap.forEach((value, key) => {
                ingredient = ingredient.replace(key, value);
            });

            //2) Remove Parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); //Thanks StackOverflow
            
            //3) Parse them into an object with count, unit, ingredients
            //Need to cut the whole ingredient to separate words
            const arrIng = ingredient.split(" ");

            //Check if there is a unit (ex: tbsp) in the array of ingredients
            const unitValues = new Set(unitMap.values());
            const unitIndex = arrIng.findIndex(el => unitValues.has(el));
            console.log(unitIndex);

            //Create an obj to store count unit ingredients
            let objIng;
        
            if(unitIndex > -1) {
                //If there is a unit
                //1 1/4 cups .... // arrCount is [1, 1/4]
                //4 cup .... // arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace("-","+"));
                } else {
                    count = eval(arrCount.join("+")); //"1+1/4" it will do the math
                } 

                objIng = {
                    count:count,
                    unit:arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(" ")
                }

            } else if(parseInt(arrIng[0],10)) {
                //If there is no unit but there is count
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: "",
                    ingredient: arrIng.slice(1).join(" ")
                }

            } else if(unitIndex === -1) { 
                //If there is no unit and no count
                objIng = {
                    count: 1,
                    unit: "",
                    ingredient: ingredient
                }
            }

            return objIng;
        });
    
        //Assign the new ingredients back
        this.ingredients = newIngredients;
    }
}

