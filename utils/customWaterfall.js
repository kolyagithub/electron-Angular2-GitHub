'use strict';

class Async {

    waterfall(callbacks, finalCb) {
        let nextCallbackNum = 0;

        next(null);

        function next(err, resp) {
            let args = Array.prototype.slice.call(arguments);
            args.shift();

            if (err) {
                return finalCb(err, resp);
            }

            if (callbacks.length > nextCallbackNum) {

                args.push(next);
                let callback = callbacks[nextCallbackNum];

                nextCallbackNum++;

                return callback.apply(this, args);
            }

            finalCb(err, resp);
        }
    }
}

module.exports = new Async();
