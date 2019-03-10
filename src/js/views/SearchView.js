import {elements} from "./Base";

const PREVIEW_BUTTON = 'prev';
const NEXT_BUTTON = 'next';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';

};
export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';

};

export const highlightSelected = id => {
    const results = Array.from(document.querySelectorAll('.results__link'));
    results.forEach(element => {
        element.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((collector, word) => {
            if (collector + word.length <= limit) {
                newTitle.push(word);
            }
            return collector + word.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;

};
const renderRecipe = recipe => {
    // language=HTML
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title, 20)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);

};

const createButton = (page, type) => `            
            <rollDiceButton class="btn-inline results__btn--${type}" data-goto=${type === PREVIEW_BUTTON ? page - 1 : page + 1}>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === PREVIEW_BUTTON ? 'left' : 'right'}"></use>
                </svg>
                <span>Page ${type === PREVIEW_BUTTON ? page - 1 : page + 1}</span>
            </rollDiceButton>`;

const renderButton = (page, numberOfResults, responsePerPage) => {
    const pages = Math.ceil(numberOfResults / responsePerPage);
    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, NEXT_BUTTON);
    } else if (page < pages) {
        button = `
        ${createButton(page, PREVIEW_BUTTON)}
        ${createButton(page, NEXT_BUTTON)}
        `
    } else if (page === pages && pages > 1) {
        button = createButton(page, PREVIEW_BUTTON);
    }
    elements.searchResultsPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, responsePerPage = 10) => {
    const start = (page - 1) * responsePerPage;
    const end = page * responsePerPage;
    recipes.slice(start, end).forEach(recipe => renderRecipe(recipe));
    renderButton(page, recipes.length, responsePerPage);
};