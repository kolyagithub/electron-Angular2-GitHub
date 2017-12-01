/**
 * Created by data-mc on 7/28/2017.
 */
const dialog = require('electron').dialog;

var showInfo = (win, msg, detail) => {
    const options = {
        type: 'info',
        title: 'INFO',
        message: msg,
        detail: detail
    };
    dialog.showMessageBox(options, (index) => {
        win.close();
    })
};

module.exports.showInfo = showInfo;