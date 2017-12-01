const express = require('express')
    , http = require('http')
    , bodyParser = require('body-parser')
    , config = require('./config/config')
    , logger = require('./../utils/logger')(__filename)
    , fs = require('fs')
    , morgan = require('morgan')
    , routes = require('./routes/routes')
    , app = express();

// route logger
var logMorgan = morgan('dev');

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routing
app.use('/', logMorgan, routes);

// skipping load GitHub content
global.skipLoadContent = false;

// create log folder if not exists
if (!fs.existsSync('logs')) {
    logger.info('Created log folder.');
    fs.mkdirSync('logs');
}

var server = http.createServer(app);
server.listen(config.port, function () {
    logger.info('Server listening on port %d ', config.port);
});
server.timeout = config.serverTimeout;

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    logger.info('SocketIO connected!');
    socket.on('skipLoadContent', function () {
        global.skipLoadContent = !global.skipLoadContent;
    });
});

module.exports.io = io;

