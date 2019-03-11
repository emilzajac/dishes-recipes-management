export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = {
            id,
            title,
            author,
            image
        };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes
            .filter(like => like.id === id)
            .map(like => this.likes.indexOf(like));
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) {
            this.likes = storage;
        }
    }
}