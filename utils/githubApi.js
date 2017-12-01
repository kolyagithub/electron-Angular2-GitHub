const ghClient = require("github")
    , config = require('../server/config/config');

var github = new ghClient({
    debug: false,
    Promise: require('bluebird'),
    protocol: 'https',
    host: 'api.github.com',
    timeout: 10000
});

github.authenticate({
    type: "oauth",
    key: config.gh.clientId,
    secret: config.gh.clientSecret
});

module.exports = github;