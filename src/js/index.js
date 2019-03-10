import Search from './models/Search';
import * as searchView from './views/searchView';
import {clearLoader, elements, renderLoader} from "./views/Base";
import Recipe from "./models/Recipe";
import * as recipeView from "./views/RecipeView";

const BUTTON_CLASS = '.btn-inline';
const CLICK = 'click';
const SUBMIT = 'submit';

const state = {};

/**
 * Search controller
 */
const controlSearch = async () => {
    // const query = searchView.getInput();
    const query = 'pizza';
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
