/**
 * Created by thomas on 29/07/2017.
 */

const {Mongo} = require('../services/Mongo');
const {CheckUser} = require('../Model/CheckUser');

class ProfilController {

    constructor() {
    }
    validateEmail (email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return re.test(email);
    }

    create (params, callback) {
        if(params.login == undefined || params.login == "") {
            callback(false, {result: "login manquant"});
        }
        if(params.email == undefined || params.email == "") {
            callback(false, {result: "email manquant"});
        }
        if(params.password == undefined || params.password == "") {
            callback(false, {result: "password manquant"});
        }
        if(!this.validateEmail(params.email)) {
            callback(false, {result: "Mauvais format d'email"});
        }
        CheckUser.checkDouble(params.login, params.email, (st, r)=> {
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.insert({login : params.login,
                        email: params.email, password : params.password }, 'user').then((r)  => {
                        delete r.ops[0].password;
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

