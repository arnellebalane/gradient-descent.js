require(['module', '../src/gradient-descent.js'], function(module, GradientDescent) {
    var gd = new GradientDescent({ features: 3, cost_threshold: 0.01 });

    var training_data = [
        { features: [1, 2, 3], label: 4 },
        { features: [2, 5, 3], label: 2 },
        { features: [2, 3, 6], label: 4 },
        { features: [5, 1, 4], label: 3 },
        { features: [8, 1, 4], label: 1 }
    ];

    gd.train(training_data);
});