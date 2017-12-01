/**
 * Created by data-mc on 7/28/2017.
 */
const dialog = require('electron').dialog;

incorrectArg = (win, msg, detail) => {
    const options = {
        type: 'warning',
        title: 'Warning',
        message: msg,
        detail: detail
    };
    dialog.showMessageBox(options, (index) => {
        process.exit(0);
    })
};

incorrectUrl = (win, msg, detail) => {
    const options = {
        type: 'warning',
        title: 'Warning',
        message: msg,
        detail: detail
    };
    dialog.showMessageBox(options, (index) => {
        process.exit(0);
    })
};

incorrectEntry = (checkRepoFn, win, msg, detail) => {
    const options = {
        type: 'warning',
        title: 'Warning',
        message: msg,
        detail: detail,
        buttons: ['Retry', 'Edit Owner/Repository name', 'Cancel']
    };
    dialog.showMessageBox(options, (index) => {
        switch (index) {
            case 0:
                checkRepoFn();
                break;
            case 1:
                break;
            case 2:
                win.close();
                break;
            default:
                break;
        }
    })

};

module.exports.incorrectArg = incorrectArg;
module.exports.incorrectUrl = incorrectUrl;
module.exports.incorrectEntry = incorrectEntry;