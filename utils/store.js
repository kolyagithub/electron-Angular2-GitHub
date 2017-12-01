class Store {

    constructor() {
        this._gsAccessToken = null;
        this._sfAccessToken = [];
        this._sfInstanceUrl = [];
    }

    get gsAccessToken() {
        return this._gsAccessToken;
    }

    set gsAccessToken(value) {
        this._gsAccessToken = value;
    }

    get sfAccessToken() {
        return this._sfAccessToken;
    }

    set sfAccessToken(value) {
        this._sfAccessToken = value;
    }

    get sfInstanceUrl() {
        return this._sfInstanceUrl;
    }

    set sfInstanceUrl(value) {
        this._sfInstanceUrl = value;
    }

}

module.exports = new Store();
