gradient-descent.js
===================

javascript gradient-descent library

##### Using gradient-descent.js in your projects

You can manually download the releases here, extract them, copy the necessary files to your project directory, and include them in your html files.

Or you can use Bower, the frontend dependency management system. This is project is not yet a Bower package so your bower.json will have to be like this:

```
{
    ...
    "dependencies": {
        ...
        "gradient-descent": "git://github.com/arnellebalane/gradient-descent.js"
    }
}
```

You can directly include the script files in your project, although this library is also AMD-compatible in case you wanna use libraries like RequireJS.

##### Sampe Usage

After successfully including this library you will have access to the `GradientDescent` class. Just create a new instance of that class, passing in a JSON object for configuration.

```
var gd = new GradientDescent({
    features: 2,
    thetas: [0, 0, 0],
    alpha: 0.01,
    cost_change_threshold: 0.000001,
    powers: [1, 1],
    normalize: false,
});
```

That will create a custom-configured gradient descent.

###### train()

To train that instance, you can use the `.train()` method.

```
gd.train(training_data);
```

The `training_data` argument must be an array of objects containing the keys `features` and `label`.

###### validate()

To validate the performace of the gradient descent and get its mean square error (MSE), you can use the `.validate()` method.

```
`gd.validate(validation_data);
```

The `validation_data` argument is of the same format with `training_data`.

###### predict()

To predict the output for a specific set of features, you can use the `.predict()` command. It accepts the array of features and returns its predicted output for that set of features.

```
var output = gd.predict([3, 4]);
```

##### Publish/Subscribe

This library implements the publish / subscribe design pattern, so you can listen to internal events from outside the library. The possible events are: `cost_update`, `theta_update`, `done`, `terminate`.

###### subscribe()

To subscribe to a specific event, you can `.subscribe()` method.

```
gd.subscribe('done', function(e) {
    console.log('DONE!');
});
```