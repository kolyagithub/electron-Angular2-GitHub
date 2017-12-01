const express = require('express')
    , router = express.Router()
    , github = require('./github');

router.use('/gh', github);

module.exports = router;

