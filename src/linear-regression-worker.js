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
var alpha = 0.1;

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
    do {
        var hypothesis_cost = cost();
        var updated_thetas = [];
        for (var i = 0; i < thetas.length; i++) {
          updated_thetas.push(update(i));
        }
        thetas = updated_thetas;
        send('update_theta', thetas);
    } while (hypothesis_cost > cost_threshold);
}

/*
 * The cost function, returns the cost of the hypothesis given
 * the values in the thetas array.
 */
function cost() {
    var result = 0;
    for (var i = 0; i < training_data.length; i++) {
        var sum = thetas[0];
        for (var j = 0; j < training_data[i].features.length; j++) {
            sum += (thetas[j + 1] * training_data[i].features[j]);
        }
        result += Math.pow(sum - training_data[i].label, 2);
    }
    return 1 / (2 * training_data.length) * result;
}

/*
 * Computes the new value for the given theta and returns it.
 */
function update(index) {
    var result = 0;
    for (var i = 0; i < training_data.length; i++) {
       var sum = thetas[0];
       for (var j = 0; j < training_data[i].features.length; j++) {
            sum += (thetas[j + 1] * training_data[i].features[j] )
       }
       result += (sum - training_data[i].label) * (index === 0 ? 1 : training_data[i].features[index - 1]);
    }
    return thetas[index] - ((alpha / training_data.length) *  result);
}

function send(command, data) {
    postMessage(JSON.stringify({ command: command, data: data }));
}