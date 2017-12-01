/**
 * Created by data-mc on 7/28/2017.
 */
const dialog = require('electron').dialog;

var showError = (win, msg, detail) => {
    const options = {
        type: 'error',
        title: 'Error',
        message: msg,
        //buttons: ['Yes', 'No'],
        detail: detail
    };
    dialog.showMessageBox(options, (index) => {
        win.close();
    })
};

module.exports.showError = showError;