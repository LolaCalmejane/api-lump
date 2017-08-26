/**
 * Created by thomas on 19/08/2017.
 */

const {CheckUser} = require('../Model/CheckUser');
const {Mongo} = require('../services/Mongo');
const ObjectID = require('mongodb').ObjectID;

class EventController {
    constructor () {
    }

    createEvent (params, callback) {
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.insert({
                        name: params.body.name,
                        userId: currentUser,
                        date : params.body.date,
                        type : params.body.type,
                        description: params.body.description,
                        pays: params.body.pays,
                        adresse: params.body.adresse,
                        codePostal: params.body.codePostal,
                        duration: params.body.duration,
                        photo: params.body.photo,
                        participants : [currentUser],
                        musics : []
                    }, 'events').then(r => {
                        callback(true, {result: "Ajout ok"});
                    }).catch(err => {
                        callback(false, {result: "Ajout nok"});
                    });

                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }
    addParticipantToEvent (params, callback) {
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.update({_id : ObjectID.createFromHexString(params.body.id), userId: currentUser},{
                        $addToSet: {
                            participants: ObjectID.createFromHexString(params.body.participant)
                        }
                    }, {}, 'events');
                    callback(true, {result: "Ajout ok"});
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    addMusicToEvent (params, callback) {
        var i = 0;
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            if(i > 0) {
                callback(false, {result : "Cet évenement n'est pas reconnu"});
            }
            i++;
            var currentUser = r.result._id;

            if(st) {
                var id = ObjectID.createFromHexString(params.body.id);
                Mongo.connect().then((q) => {
                    q.dbConnection
                        .collection('events')
                        .findOne({_id : id, participants : {$in : [currentUser]}})
                        .then(r => {
                            if(r == undefined) {
                                callback(false, {result: "Vous ne participez pas à cet évenement"});
                            } else {
                                Mongo.update({_id : id}, {
                                    $addToSet: {
                                        musics: {
                                            id :params.body.music,
                                            ranking : []
                                        }
                                    }
                                }, {}, 'events');
                                callback(true, {result: "Ajout ok"});
                            }
                        }).catch(err => {
                        callback(false, {result: "Cet évenement n'est pas reconnu"});
                    });

                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    addRankingToMusic (params, callback) {
        var i = 0;
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            if(i > 0) {
                callback(false, {result : "Cet évenement n'est pas reconnu"});
            }
            i++;
            var currentUser = r.result._id;

            if(st) {
                var id = ObjectID.createFromHexString(params.body.id);
                Mongo.connect().then((q) => {
                    q.dbConnection
                        .collection('events')
                        .findOne({_id : id, participants : {$in : [currentUser]}})
                        .then(r => {
                            if(r == undefined) {
                                callback(false, {result: "Vous ne participez pas à cet évenement"});
                            } else {
                                var prop = "musics."+params.body.position+".ranking";
                                Mongo.update({_id : id}, {
                                    $addToSet: {
                                        [prop]: {
                                            rank : params.body.ranking,
                                            user : currentUser
                                        }
                                    }
                                }, {}, 'events');
                                callback(true, {result: "Ajout ok"});
                            }
                        }).catch(err => {
                            console.log(err);
                        callback(false, {result: "Cet évenement n'est pas reconnu"});
                    });

                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    getEventOfUser (params, callback) {
        CheckUser.getUser(params.query.authorization, (st, r)=> {
            var currentUser = r.result._id;
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.find({userId : currentUser}, 'events').then(r => {
                        callback(true, r);
                    }).catch(r => {
                        callback(false, r);
                    })
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    getEventForDisconnectedUser(params, callback) {
        Mongo.connect().then((q) => {
            Mongo.find({_id : ObjectID.createFromHexString(params.body.id)}, 'events').then(r => {
                callback(true, r);
            }).catch(r => {
                callback(false, r);
            })
        });
    }
}
module.exports.EventController = new EventController();
