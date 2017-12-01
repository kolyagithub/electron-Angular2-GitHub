module.exports = {
    host: 'localhost',
    port: 3310,
    resultFile: './content.json',
    serverTimeout: 20 * 60 * 1000, // 20 minute

    gh: {
        // https://github.com/settings/developers
        oauthUrl: 'https://github.com/login/oauth/authorize',
        callbackUrl: `http://localhost/callback`,
        accessUrl: 'https://github.com/login/oauth/access_token',
        clientId: '2ffd067aaff3d9eabe64',
        clientSecret: 'f00aebb4f61cf1f217ed65a455b5d59cebde2d35'
    }
};