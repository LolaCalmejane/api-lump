/**
 * Created by thomas on 29/07/2017.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoClient = require('mongodb').MongoClient, assert = require('assert'), Mongodb = require('mongodb'), Q = require("q");
/**
 * Mongo Manager
 */
var Mongo = (function () {
    function Mongo() {
        this.dbConnection = null;
    }
    /**
     * Connection to DB
     * @param  {any}    callback callback function
     */
    Mongo.prototype.connect = function () {
        var _this = this;

        var deferred = Q.defer();
        // Use connect method to connect to the server
        MongoClient.connect(Mongo.url, function (err, db) {
            assert.equal(null, err);
            //console.log("Connected successfully to server");
            _this.dbConnection = db;
            //promise the instance of the prototype
            deferred.resolve(_this);
        });
        return deferred.promise;
    };
    /**
     * personnalize a mongoId
     * @return {string} the token
     */
    Mongo.prototype.createId = function () {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    };
    /**
     * insert document using Q
     * @param  {any}    document   the object to insert
     * @param  {string} collection the collection name
     * @return {any}               the promise
     */
    Mongo.prototype.insert = function (document, collection) {
        var _this = this;
        var deferred = Q.defer();
        this.dbConnection.collection(collection).insertOne(document, function (err, result) {
            _this.dbConnection.close();
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    /**
     * remove a document, Q method
     * @param {any}    document   matching document
     * @param {string} collection collection name
     * @param {any}    callback   the callback function
     */
    Mongo.prototype.remove = function (document, collection) {
        var _this = this;
        var deferred = Q.defer();
        this.dbConnection.collection(collection).deleteOne(document, function (err, result) {
            _this.dbConnection.close();
            console.log(result);
            if (!err) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(JSON.stringify(err)));
            }
        });
    };
    /**
     * find document using Q
     * @param {any}    document   matching parameter
     * @param {string} collection collection name
     * @return {any}               the promise
     */
    Mongo.prototype.find = function (document, collection) {
        var _this = this;
        var deferred = Q.defer();
        this.dbConnection.collection(collection).find(document).toArray(function (err, result) {

            _this.dbConnection.close();
            if (!err) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(JSON.stringify(err)));
            }
        });
        return deferred.promise;
    };

    Mongo.prototype.update = function (match, update, options, collection)
    {
        var _this = this;
        return this.dbConnection.collection(collection).update(match,update,options);
    }
    return Mongo;
}());
Mongo.url = 'mongodb://localhost:27017/lump';
exports.Mongo = new Mongo();
