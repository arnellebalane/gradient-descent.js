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
function configure(config) {
    thetas = config.thetas || thetas;
    cost_threshold = config.cost_threshold || cost_threshold;
}

/*
 * Handler function when executing the `train` command.
 * 
 * parameters:
 *    data - an array of training data, each an object with the keys
 *           `features` and `label`.
 */
function train(data) {
    // @todo solve for the cost given the values of the thetas
    // @todo update the thetas if necessary
    //       everytime the thetas array is fully updated, send a message
    //       back to the parent script containing the new theta values
}


/*
 * The cost function, returns the cost of the hypothesis given
 * the values in the thetas array.
 */
function cost() {
    // @todo implement this
}

/*
 * Computes the new value for the given theta and returns it.
 */
function update(theta) {

}

function send(command, data) {
    postMessage(JSON.stringify({ command: command, data: data }));
}