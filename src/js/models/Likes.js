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
        return like;
    }

    //TODO Check
    deleteLike(id) {
        const index = this.likes
            .filter(like => like.id === id)
            .map(like => this.likes.indexOf(like));
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }
}