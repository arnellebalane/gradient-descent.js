onmessage = function(e) {
    e = JSON.parse(e.data);
    if (e.command === 'configure') {
        configure(e.data);
    } else if (e.command === 'train') {
        train(e.data);
    }
};

var thetas = [0];
var cost_threshold = 0.01;
var training_data = [];
var alpha = 0.01;

function configure(config) {
    thetas = config.thetas || thetas;
    cost_threshold = config.cost_threshold || cost_threshold;
    alpha = config.alpha || alpha;
}

/*
 * Handler function when executing the `train` command.
 * 
 * parameters:
 *    data - an array of training data, each an object with the keys
 *           `features` and `label`.
 */
function train(data) {
    training_data = data;
    do {
        var hypothesis_cost = cost();
        var updated_thetas = [];
        for (var i = 0; i < thetas.length; i++) {
          updated_thetas.push(update(i));
        }
        thetas = updated_thetas;
        send('update_theta', thetas);
        send('update_cost', hypothesis_cost);
    } while (hypothesis_cost > cost_threshold);
    send('done', null);
}

/*
 * The cost function, returns the cost of the hypothesis given
 * the values in the thetas array.
 */
function cost() {
    var sum = 0;
    for (var i = 0; i < training_data.length; i++) {
        sum += Math.pow(hypothesis(training_data[i].features) - training_data[i].label, 2);
    }
    return 1 / (2 * training_data.length) * sum;
}

/*
 * Computes the new value for the given theta and returns it.
 */
function update(index) {
    var sum = 0;
    for (var i = 0; i < training_data.length; i++) {
        var features = training_data[i].features;
       sum += (hypothesis(features) - training_data[i].label) * (index === 0 ? 1 : features[index - 1]);
    }
    return thetas[index] - ((alpha / training_data.length) *  sum);
}

/*
 * Computes the hypothesis given the array of features.
 */
function hypothesis(x) {
    var sum = thetas[0];
    for (var i = 0; i < x.length; i++) {
        sum += thetas[i + 1] * x[i];
    }
    return sum;
}

function send(command, data) {
    postMessage(JSON.stringify({ command: command, data: data }));
}