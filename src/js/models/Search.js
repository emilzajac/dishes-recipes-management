import axios from 'axios';
import {key, proxy} from '../Config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        try {
            const response = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = response.data.recipes;
        } catch (error) {
            alert(error);
        }

    }
}

