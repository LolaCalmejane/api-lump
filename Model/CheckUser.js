/**
 * Created by thomas on 02/08/2017.
 */

const {Mongo} = require('../services/Mongo');
const {atob} = require('atob');

class CheckUser {
    constructor() {
    }

    getUser (auth, callback) {
        var auth = atob(auth).split(':');
        Mongo.connect().then(q=>{
            q
                .dbConnection
                .collection('user')
                .findOne({login : auth[0], password : auth[1]})
                .then(r=>{
                    if(r == undefined) {
                        callback(false,{result : "cet utilisateur n'existe pas"});
                    } else {
                        callback(true,{result : r});
                    }

                }).catch(err => {
                callback(false,{result : 'Invalid User'});
            })
        })
    };

    checkDouble (login, email, callback) {

        Mongo.connect().then(q=>{
            q
                .dbConnection
                .collection('user')
                .findOne({$or : [{login : login}, {email : email}]})
                .then(r=>{

                    if(r == undefined) {
                        callback(true, {result : ""});
                    } else {
                        callback(false, {result : 'This User still exist'});
                    }
                }).catch(err => {
                    callback(false, {result : 'Invalid User'});
                });
        });
    };
}

module.exports.CheckUser = new CheckUser();