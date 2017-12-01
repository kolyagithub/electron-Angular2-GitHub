const express = require('express');
const routes = express.Router();
const controller = require('../controller/github');

routes.post('/checkRepository', controller.checkRepository);
routes.get('/oauthUrl', controller.oauthUrl);
routes.post('/accessToken', controller.accessToken);
routes.post('/availableRepoTables', controller.availableRepoTables);
routes.post('/loadData', controller.loadData);

module.exports = routes;
