'use strict';

/* jshint expr:true */

var Waterline = require('waterline');
var sailsmemory = require('sails-memory');
var mock = require('../lib/index');
var should = require('should');

describe('test mocks', function() {

    var User;

    before(function(done) {
        var waterline = new Waterline();
        var Model = Waterline.Collection.extend({
            identity: 'user',
            connection: 'memory',
            attributes: {
                name: {
                    type: 'string',
                    defaultsTo: 'Foo Bar'
                },
                doSomething: function() {}
            }
        });
        waterline.loadCollection(Model);
        var connections = {
            memory: {
                adapter: 'sails-memory'
            }
        };
        waterline.initialize({
            adapters: {
                'sails-memory': sailsmemory
            },
            connections: connections
        }, function(err, colls) {
            if (err) return done(err);
            User = colls.collections.user;
            // create a user to test our mocking against
            User.create({
                name: 'lauren'
            }).exec(function(err, res) {
                done();
            });
        });
    });


    it('should work with an un-mocked find', function(done) {
        User.find({
                name: 'lauren'
            })
            .then(function(users) {
                users.should.have.lengthOf(1);
                users[0].name.should.equal('lauren');

            })
            .done(done, done);
    });

    it('should be mockable with then', function (done) {
        var users = [{name: 'winnie'}, {name:'matilda'}];
        var findStub = mock.mockModel(User, 'find', users);

        User.find({name: 'anything'})
        .then(function (results) {
            findStub.restore();
            results.should.eql(users);
            findStub.calledOnce.should.be.true;
        })
        .done(done, done);
    });

    it('should be mockable with exec', function (done) {
        var users = [{name: 'winnie'}, {name:'matilda'}]; 
        var findStub = mock.mockModel(User, 'find', users);

        User.find({name: 'anything'})
        .then(function (results) {
            findStub.restore();
            results.should.eql(users);
            findStub.calledOnce.should.be.true;
        })
        .done(done, done);
    });

    it('should be mockable without exec or then', function (done) {
        var users = [{name: 'winnie'}, {name:'matilda'}]; 
        var findStub = mock.mockModel(User, 'find', users);

        User.find({name: 'anything'}, function (err, results) {
            findStub.restore();
            results.should.eql(users);
            findStub.calledOnce.should.be.true;
            done();
        });
    });

    it('should work with populate', function (done) {
        var users = [{name: 'winnie'}, {name:'matilda'}]; 
        var findStub = mock.mockModel(User, 'find', users);

        User.find({name: 'anything'})
            .populate('anythingelse')
            .then(function (results) {
                findStub.restore();
                results.should.eql(users);
                findStub.calledOnce.should.be.true;
            })
            .done(done, done);
    });

    it('should work with populate and limit', function (done) {
        var users = [{name: 'winnie'}, {name:'matilda'}]; 
        var findStub = mock.mockModel(User, 'find', users);

        User.find({name: 'anything'})
            .populate('anythingelse')
            .limit(10)
            .then(function (results) {
                findStub.restore();
                results.should.eql(users);
                findStub.calledOnce.should.be.true;
            })
            .done(done, done);
    });

    it('should work with findOne', function (done) {
        var user = {name:'matilda'}; 
        var findOneStub = mock.mockModel(User, 'findOne', user);

        User.findOne({name: 'anything'})
            .populate('anythingelse')
            .then(function (results) {
                findOneStub.restore();
                results.should.eql(user);
                findOneStub.calledOnce.should.be.true;
            })
            .done(done, done);
    });

    it('should work with count', function (done) {
        var user = 5;
        var countStub = mock.mockModel(User, 'count', user);

        User.count({name: 'anything'})
            .populate('anythingelse')
            .then(function (results) {
                countStub.restore();
                results.should.eql(5);
                countStub.calledOnce.should.be.true;
            })
            .done(done, done);
    });

});
