import Search from './models/Search';
import * as searchView from './views/searchView';
import {clearLoader, elements, renderLoader} from "./views/Base";

const BUTTON_CLASS = '.btn-inline';
const CLICK = 'click';
const SUBMIT = 'submit';

const state = {};
const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchResult);
        await state.search.getResult();
        clearLoader();
        console.log(state.search.result);
        searchView.renderResults(state.search.result);
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