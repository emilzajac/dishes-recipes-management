import Search from './models/Search';
import * as searchView from './views/searchView';
import {clearLoader, elements, renderLoader} from "./views/Base";

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

elements.searchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    controlSearch();
});
