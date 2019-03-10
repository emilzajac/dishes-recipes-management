import {key, proxy} from '../Config';
import axios from "axios/index";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
            console.log(result);
        } catch (error) {
            console.log(error);
            alert('Somethig were wrong')
        }
    }

    calcTime() {
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3);
        this.time = periods * 15;
    }

    calculateServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        this.ingredients = this.ingredients.map(element => {
            // Uniform units
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, unit and ingredient
            const arrayOfIngredients = ingredient.split(' ');
            const unitIndex = arrayOfIngredients.findIndex(element2 => units.includes(element2));

            let objectIngredient;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrayCount = arrayOfIngredients.slice(0, unitIndex);

                let count;
                if (arrayCount.length === 1) {
                    count = eval(arrayOfIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrayOfIngredients.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    count,
                    unit: arrayOfIngredients[unitIndex],
                    ingredient: arrayOfIngredients.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrayOfIngredients[0], 10)) {
                // There is no unit, but 1st element is number
                objectIngredient = {
                    count: parseInt(arrayOfIngredients[0], 10),
                    unit: '',
                    ingredient: arrayOfIngredients.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is no unit and no number in 1st position
                objectIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objectIngredient;
        });
    }
}