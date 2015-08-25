'use strict';

var utils = {};
var sinon = require('sinon');
var Deferred = require('waterline/lib/waterline/query/deferred');
var _ = require('lodash');

function mockDeferred(model, criteria, error, success) {
    criteria = criteria || {};
    var deferred = new Deferred({}, function() {}, {});

    sinon.stub(deferred, 'populate', function() {
        return this;
    });

    sinon.stub(deferred, 'where', function (crit) {
       _.extend(criteria, crit);
       return this;
    });

    sinon.stub(deferred, 'exec', function(cb) {
        if (error) return cb(error);
        if (typeof success === 'function') {
            success = success.call(model, criteria);
        }
        return cb(null, success);
    });

    return deferred;
}

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
                if (typeof success === 'function') {
                    success = success.call(model, criteria);
                }
                return cb(null, success);
            }, 1);
        }
        return mockDeferred(model, criteria, error, success);
    });

};

module.exports = utils;
