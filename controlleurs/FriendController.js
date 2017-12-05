/**
 * Created by thomas on 02/08/2017.
 */

const {Mongo} = require('../services/Mongo');
const {CheckUser} = require('../Model/CheckUser');
const ObjectID = require('mongodb').ObjectID;
class FriendController {

    constructor() {
    }

    addFriend (params, callback)
    {
        var Id = ObjectID.createFromHexString(params.params.user);
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;
            var login = r.result.login;
            if(st) {
                Mongo.connect().then((q) => {
                    q
                        .dbConnection
                        .collection('user')
                        .findOne({_id : Id})
                        .then(r=>{
                            if(r==undefined) {
                                callback(false, {result : "Cet utilisateur n'éxiste pas"});
                            } else {
                                Mongo.update(
                                    {_id : currentUser},
                                    {
                                        $addToSet :
                                            {
                                                friend: {
                                                    id : r._id,
                                                    name : r.login
                                                }
                                            }
                                        },
                                    {},
                                    'user'
                                );
                                Mongo.update(
                                    {_id : r._id},
                                    {
                                        $addToSet : {
                                            friend: {
                                                id : currentUser,
                                                name : login
                                            }
                                        }
                                    },
                                    {},
                                    'user'
                                );
                                callback(true, {result : "Ajout ok"});
                            }
                        });
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    getFriends (params, callback) {
        var ids = [];
        for(var i = 0; i < params.ids.length; i++) {
            ids[i] = ObjectID.createFromHexString(params.ids[i]);
        }
        CheckUser.getUser(params.authorization, (st, r)=> {
            if(st) {

                Mongo.connect().then((q) => {
                    Mongo.find({_id: {$in: ids}},'user').then(r => {

                        for(var i = 0; i<r.length; i++) {
                            delete r[i].password;
                            delete r[i].email;
                        }
                        callback(true, {result : r});
                    });
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    deleteFriend (params, callback) {
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;
            var login = r.result.login;
            if (st) {
                Mongo.connect().then((q) => {
                    q
                        .dbConnection
                        .collection('user')
                        .findOne({_id: ObjectID.createFromHexString(params.params.id)})
                        .then(r => {
                            if(r==undefined) {
                                callback(false, {result : "Cet utilisateur n'éxiste pas"});
                            } else {
                                Mongo.update({_id: currentUser}, {$pull: {friend: { id: r._id, name : r.login}}}, {}, 'user');
                                Mongo.update({_id: r._id}, {$pull: {friend: { id : currentUser, name : login}}}, {}, 'user');
                                callback(true, {result : "Suppression ok"});
                            }
                    });
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }
}

module.exports.FriendController = new FriendController();
