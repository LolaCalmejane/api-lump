/**
 * Created by thomas on 29/07/2017.
 */

const {Mongo} = require('../services/Mongo');
const {CheckUser} = require('../Model/CheckUser');

class ProfilController {

    constructor() {
    }

    create (params, callback) {
        if(params.login == undefined) {
            callback(false, {result: "login manquant"});
        }
        if(params.email == undefined) {
            callback(false, {result: "email manquant"});
        }
        if(params.password == undefined) {
            callback(false, {result: "password manquant"});
        }
        CheckUser.checkDouble(params.login, params.email, (st, r)=> {
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.insert({login : params.login,
                        email: params.email, password : params.password }, 'user').then((r)  => {
                        callback(true, {result : r.ops[0]});
                    });
                });
            } else {
                callback(st, {result : "Cette utilisateur éxiste déjà"});
            }
        });
    };

    login (params, callback) {
        CheckUser.getUser(params.authorization, function(st, r) {
            if(st) {
                delete r.result.password;
            }
            callback(st, r);
        });
    };

    search (params, callback) {
        CheckUser.getUser(params.authorization, (st, r) => {
            if(st) {
                Mongo.connect().then(q => {
                    var re = new RegExp(".*"+params.login+".*");
                    Mongo.find({login : re}, 'user').then(r => {
                        callback(true, r);
                    }).catch(r => {
                        callback(false, r);
                    })
                });
            } else {
                callback(false, r);
            }

        });
    };
};

module.exports.ProfilController = new ProfilController();

