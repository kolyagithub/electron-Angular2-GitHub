const {app, BrowserWindow, dialog} = require('electron')
    , fs = require('fs')
    , path = require('path')
    , url = require('url')
    , logger = require('../utils/logger')(__filename)
    , root = path.resolve(__dirname, '..');

let appWin;

var exports = module.exports = {};

// Instantiate Express App
app.server = require('../server/server.js').app;

app.on('ready', async () => {

    // get app mode
    var argValue = ((typeof process.env.NODE_ENV !== 'undefined') && (process.env.NODE_ENV = 'dev')) ? process.argv[2] : process.argv[1];

    if (process.argv.length < 2 || (argValue !== '--github')) {
        console.error('Incorrect binary argument!');
        const options = {
            type: 'warning',
            title: 'Warning',
            message: 'Binary argument empty or incorrect!'
        };
        return dialog.showMessageBox(options, (index) => {
            process.exit(0);
        })
    }

    switch (argValue) {
        case '--github':
            appWin = initGitHub(appWin);
            break;
        default:
            break;
    }

    if (process.env.NODE_ENV === 'dev') {
        appWin.show();
    }
    else {
        appWin.webContents.session.clearStorageData({
            storages: [
                'appcache',
                'cookies',
                'filesystem',
                'indexdb',
                'localstorage',
                'shadercache',
                'websql',
                'serviceworkers',
            ],
            quotas: [
                'temporary',
                'persistent',
                'syncable',
            ]
        }, () => {
            appWin.show();
        });
    }

    // Open the DevTools.
    //appWin.webContents.openDevTools();

    // Emitted when the window is closed.
    appWin.on('closed', () => {
        appWin = null;
    });
});

app.on('window-all-closed', () => {
    app.quit()
});

app.on('error', (err) => {
    logger.error('Error in electron app: ', err);
});

exports.getCurrentWindow = () => {
    return appWin;
};

exports.closeApp = () => {
    appWin.close();
};

function initGitHub(win) {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        autoHideMenuBar: true,
        resizable: true,
        frame: false,
        show: false
    });
    win.loadURL(`file://${root}/dist/github/index.html`);
    return win;
}