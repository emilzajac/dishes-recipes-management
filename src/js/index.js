import Search from './models/Search';
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from './views/searchView';
import * as recipeView from "./views/RecipeView";
import * as ListView from "./views/ListView";
import {clearLoader, elements, renderLoader} from "./views/Base";

const BUTTON_CLASS = '.btn-inline';
const CLICK = 'click';
const SUBMIT = 'submit';

const state = {};
window.state = state;

/**
 * Search controller
 */
const controlSearch = async () => {
    const query = searchView.getInput();
    // const query = 'pizza';
    if (query) {
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchResult);
        try {
            // Search for recipes
            await state.search.getResult();

            // Render results on UI
            clearLoader();
            console.log(state.search.result);
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something wrong with the search...')
        }
    }
};

elements.searchForm.addEventListener(SUBMIT, event => {
    event.preventDefault();
    controlSearch();
});

/**
 * For testing purpose
 */
window.addEventListener('load', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener(CLICK, event => {
    const button = event.target.closest(BUTTON_CLASS);
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Recipe controller
 */
const controlRecipe = async () => {
    // Get Id from url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected recipe
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calculateServings();

            // Render recipe
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert('Error processing recipe')
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */
const controlList = () => {
    // Create a new list if there in none yet
    if (!state.list) {
        state.list = new List();
    }
    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        ListView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shoppingList.addEventListener(CLICK, event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete rollDiceButton
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        ListView.deleteItem(id);

        // Handle the count update
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);
        state.list.updateCount(id, value);
    }
});

// Handling recipe button clicks
elements.recipe.addEventListener(CLICK, event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease rollDiceButton is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase rollDiceButton is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
    console.log(state.recipe);
});
