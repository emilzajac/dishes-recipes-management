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
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchResult);
        try {
            await state.search.getResult();
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
    const id = window.location.hash.replace('#', '');
    if (id) {
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calculateServings();

            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert('Error processing recipe')
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
