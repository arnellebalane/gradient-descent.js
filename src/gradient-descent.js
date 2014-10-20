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
        if (!this.thetas.length) {
            for (var i = 0; i <= this.features; i++) {
                this.thetas.push(0);
            }
        }
        this._normalize = config.normalize || false;
        this.averages = [];
        this.ranges = [];
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
         *           `features` and `label`, or an array of features for a 
         *            specific data.
         */
        this.normalize = function(data) {
            if (typeof data[0] === 'object') {
                for (var i = 0; i < data[0].features.length; i++) {
                    var sum = 0;
                    var min = data[0].features[i];
                    var max = data[0].features[i];
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].features[i] < min) {
                            min = data[j].features[i];
                        } else if (data[j].features[i] > max) {
                            max = data[j].features[i];
                        }
                        sum += data[j].features[i];
                    }
                    var average = sum / data.length;
                    var range = max - min;
                    this.averages.push(average);
                    this.ranges.push(range);
                    for (var k = 0; k < data.length; k++) {
                        data[k].features[i] = (data[k].features[i] - average) / range;
                    }
                }
            } else {
                for (var l = 0; l < data.length; l++) {
                    data[l] = (data[l] - this.averages[l]) / this.ranges[l];
                }
            }
            return data;
        };

        /*
         * Predicts the label for the given set of features.
         *
         * parameters:
         *    features - an array of features whose label or value needs 
         *               to be predicted.
         */
        this.predict = function(features) {
            if (this._normalize) {
                features = this.normalize(features);
            }
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