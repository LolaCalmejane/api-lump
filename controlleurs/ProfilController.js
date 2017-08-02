/**
 * Created by thomas on 29/07/2017.
 */

const {Mongo} = require('../services/Mongo');
const {crypto} = require('crypto');
const {atob} = require('atob');

class ProfilController {

    constructor() {
    }

    create (params, callback) {
        Mongo.connect().then((q) => {
            Mongo.insert({login : params.login,
                email: params.email, password : params.password }, 'user').then(r => {
                    console.log(r);
                    callback(r);
            });
        })
    };

    login (params, callback) {
        Mongo.connect().then(q=>{
            q
                .dbConnection
                .collection('user')
                .findOne({login : params.login, password : params.password})
                .then(r=>{
                    callback(true,'connection ok');
            }).catch(err => {
                callback(false,'Invalid User');
            })
        })
    };

    search (params, callback) {
        var auth = atob(params.authorization).split(':');

        Mongo.connect().then(q => {
            var re = new RegExp(".*"+params.login+".*");
            Mongo.find({login : re}, 'user').then(r => {
                callback(true, r);
            }).catch(r => {
                callback(false, r);
            })
        });
    };
};

module.exports.ProfilController = new ProfilController();

