(function(root, library) {
    if (typeof define === 'function' && define.amd) {
        define(['require'], library);
    } else {
        root.GradientDescent = library();
    }
})(this, function(require) {
    var path = require.toUrl('.');

    function GradientDescent(config) {
        config = config || {};
        this.type = config.type || 'linear-regression';
        this.features = config.features || 1;
        this.thetas = config.thetas || [];
        this.cost_threshold = config.cost_threshold || 0.01;
        if (!this.thetas.length) {
            for (var i = 0; i <= this.features; i++) {
                this.thetas.push(0);
            }
        }

        // properties used for the publish/subscribe model
        this.subscribers = {};

        /*
         * Trains the gradient descent with the given training data by 
         * passing the training data to the appropriate web worker instance
         * for processing.
         *
         * parameters:
         *    data - an array of training data, each an object with the keys
         *           `features` and `label`.
         */
        this.train = function(data) {
            var worker = null;
            if (this.type === 'linear-regression') {
                worker = new Worker(path + '/linear-regression-worker.js');
            }
            var config = { thetas: this.thetas, cost_threshold: this.cost_threshold };
            worker.postMessage(JSON.stringify({ command: 'configure', data: config }));
            worker.postMessage(JSON.stringify({ command: 'train', data: data }));

            worker.onmessage = function(e) {
                e = JSON.parse(e.data);
                if (e.command === 'log') {
                    console.info(e.data);
                } else if (e.command === 'update_theta') {
                    this.thetas = e.data;
                }
            };
        };

        /*
         * Predicts the label for the given set of features.
         *
         * parameters:
         *    features - an array of features whose label or value needs 
         *               to be predicted.
         */
        this.predict = function(features) {
            // @todo implement this
        };

        this.publish = function(event, data) {
            // @todo implement this
        };

        this.subscribe = function(event, callback) {
            // @todo implement this
        };
    }

    return GradientDescent;
});