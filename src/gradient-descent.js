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
        this.cost = 1000;
        this.cost_threshold = config.cost_threshold || 0.01;
        this.alpha = config.alpha || 0.01;
        this._normalize = config.normalize || false;
        if (!this.thetas.length) {
            for (var i = 0; i <= this.features; i++) {
                this.thetas.push(0);
            }
        }
        var self = this;

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
            if (this._normalize) {
                data = this.normalize(data);
            }
            var worker = null;
            if (this.type === 'linear-regression') {
                worker = new Worker(path + '/linear-regression-worker.js');
            }
            var config = { thetas: this.thetas, cost_threshold: this.cost_threshold, alpha: this.alpha };
            worker.postMessage(JSON.stringify({ command: 'configure', data: config }));
            worker.postMessage(JSON.stringify({ command: 'train', data: data }));

            worker.onmessage = function(e) {
                e = JSON.parse(e.data);
                if (e.command === 'log') {
                    console.info(e.data);
                } else if (e.command === 'update_theta') {
                    self.thetas = e.data;
                } else if (e.command === 'update_cost') {
                    self.cost = e.data;
                    console.info('cost: ' + self.cost);
                } else if (e.command === 'done') {
                    self.publish('done', self.thetas);
                }
            };
        };

        /*
         * Normalizes the given data by applying feature scaling and mean
         * normalization to the features.
         *
         * parameters:
         *    data - an array of training data, each an object with the keys
         *           `features` and `label`.
         */
        this.normalize = function(data) {
            // @todo implement this
        }

        /*
         * Predicts the label for the given set of features.
         *
         * parameters:
         *    features - an array of features whose label or value needs 
         *               to be predicted.
         */
        this.predict = function(features) {
            var result = this.thetas[0];
            for (var i = 0; i < features.length; i++) {
                result += (this.thetas[i + 1] * features[i]);
            }
            return result;
        };

        this.publish = function(event, data) {
            if (this.subscribers.hasOwnProperty(event)) {
                this.subscribers[event].forEach(function(callback) {
                    callback(data);
                });
            }
        };

        this.subscribe = function(event, callback) {
            if (!this.subscribers.hasOwnProperty(event)) {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(callback);
        };
    }

    return GradientDescent;
});