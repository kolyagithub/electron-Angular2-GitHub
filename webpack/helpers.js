const path = require('path');

// Helper functions
const ROOT = path.resolve(__dirname, '..');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    var _root = path.join.apply(path, [ROOT].concat(args));
    return _root;
}

module.exports = {
    root
};
