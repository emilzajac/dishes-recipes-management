import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '06d24c86cb828f91b86ecd176915590d';
        try {
            const response = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = response.data.recipes;
        } catch (error) {
            alert(error);
        }

    }
}

