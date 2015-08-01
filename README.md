# sails-mock-models
Simple mocking for sails model queries, based on [sinon](http://sinonjs.org/)

Mock any of the standard query methods (ie 'find', 'count', 'update')
They will be called with no side effects.

#### Creating a mock with a success response:
```
var mock = require('sails-mock-models');
var users = [{name: 'winnie'}, {name:'matilda'}];
mock.mockModel(User, 'find', users);
```

#### Creating an error response
```
var mock = require('sails-mock-models');
var error = new Error('You did something really bad');
mock.mockModel(User, 'find', null, error);
```

The mocks work fine with any of the execution types waterline allows
```
// promise version

var mock = require('sails-mock-models');
var users = [{name: 'winnie'}, {name:'matilda'}];
mock.mockModel(User, 'find', users);

User.find({name: 'anything'})
  .populate('something')
  .limit(5)
  .then(function (results) {
    console.log(results === users);
    // remember to restore the method once you are done testing it
    User.find.restore();
  })
  .done(done, done);
```

```
// exec version, error case
var mock = require('sails-mock-models');
var err = new Error('So bad');
mock.mockModel(User, 'findOne', null, err);

User.findOne({name: 'anything'})
  .populate('some association')
  .populate('some other association')
  .exec(function (err, result) {
    console.log(err === user);
    User.findOne.restore();
  });
```

```
// callback version
var mock = require('sails-mock-models');
mock.mockModel(User, 'count', 5);

User.count({name: 'anything'}, function (err, count) {
  console.log(count === 5);
  User.count.restore();
});
```
