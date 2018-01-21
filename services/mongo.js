/**
 * Created by thomas on 29/07/2017.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoClient = require('mongodb').MongoClient;
/**
 * Mongo Manager
 */
class Mongo {
    constructor () {
        this.url = 'mongodb://localhost:27017/lump';
        this.dbConnection = null;
        this.connect();
    }
    /**
     * Connection to DB
     * @param  {any}    callback callback function
     */
    connect () {
        return new Promise(resolve => {
            if (this.dbConnection !== null) {
                resolve(this);
            } else {
                // Use connect method to connect to the server
                MongoClient.connect(this.url, (err, db) => {
                    //console.log("Connected successfully to server");
                    this.dbConnection = db;
                    //promise the instance of the prototype
                    return resolve(this);
                });
            }
        });
    };
    /**
     * personnalize a mongoId
     * @return {string} the token
     */
    createId () {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    };
    /**
     * insert document using Q
     * @param  {any}    document   the object to insert
     * @param  {string} collection the collection name
     * @return {Promise}               the promise
     */
    insert (document, collection) {
        return new Promise((res, rej) => {
            this.dbConnection.collection(collection).insertOne(document, function (err, result) {
                if (err) {
                    return rej(new Error(JSON.stringify(err)));
                }
                res(result);
            });
        });
    };
    /**
     * remove a document, Q method
     * @param {any}    document   matching document
     * @param {string} collection collection name
     * @param {any}    callback   the callback function
     */
    remove (document, collection) {
        return new Promise((res, rej) => {
            this.dbConnection.collection(collection).deleteOne(document, function (err, result) {
                if (!err) {
                    return res(result);
                }
                else {
                    return rej(new Error(JSON.stringify(err)));
                }
            });
        });
    };
    /**
     * find document using Q
     * @param {any}    document   matching parameter
     * @param {string} collection collection name
     * @return {any}               the promise
     */
    find (document, collection) {
        return new Promise((res, rej) => {
            this.dbConnection.collection(collection).find(document).toArray(function (err, result) {
                if (!err) {
                    return res(result);
                }
                else {
                    return rej(new Error(JSON.stringify(err)));
                }
            });
        });
    };

    /**
     * find a single document
     *
     * @param {any}    document   matching parameter
     * @param {string} collection collection name
     * @returns {Promise} result : object of single document, err : object, Mongo error
     */
    findOne (document, collection)
    {
        return new Promise((res, rej) => {
            this.dbConnection.collection(collection).findOne(document, (err, result) => {
                if (err) {
                    return rej(new Error(JSON.stringify(err)));
                }
                res(result);
            });
        });
    }

    update (match, update, options, collection)
    {
        return this.dbConnection.collection(collection).update(match,update,options);
    }

}

exports.Mongo = new Mongo();
