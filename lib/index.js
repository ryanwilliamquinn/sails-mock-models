var utils = {};
var sinon = require('sinon');
var Deferred = require('waterline/lib/waterline/query/deferred');
var Promise = require('bluebird');

function mockDeferred(error, success) {
    var deferred = new Deferred(this, function() {}, {});

    sinon.stub(deferred, 'populate', function() {
        return this;
    });

    sinon.stub(deferred, 'exec', function(cb) {
        if (error) return cb(error);
        return cb(null, success);
    });

    return deferred;
};

utils.mockModel = function(model, method, success, error) {
    return sinon.stub(model, method, function(criteria, options, cb) {
        if (typeof criteria === 'function') {
            cb = criteria;
        }
        if (typeof options === 'function') {
            cb = options;
        }
        if (cb) {
            return setTimeout(function() {
                if (error) return cb(error);
                return cb(null, success);
            }, 1);
        }
        return mockDeferred(error, success);
    });

};

module.exports = utils;
