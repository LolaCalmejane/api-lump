/**
 * Created by thomas on 04/08/2017.
 */
const {YouTubeService} = require('../services/youtube');
const {CheckUser} = require('../Model/CheckUser');
const {Mongo} = require('../services/Mongo');
const ObjectID = require('mongodb').ObjectID;

class MusicController {
    constructor () {
    }

    search (params, callback) {
        CheckUser.getUser(params.authorization, (st, r)=> {
            if(st) {
                params.type = params.type || 'video';
                params.limit = params.limit || 6;
                YouTubeService.searchVideo(params.search,params.type, callback, params.limit);
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    addToMusics (params, callback) {
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.update({_id : currentUser}, {$addToSet :
                        {
                            musics : {
                                videoId : params.body.videoId,
                                title : params.body.title,
                                channel : params.body.channel,
                                thumbnails : params.body.thumbnails
                            }
                        }
                    },{}, 'user');
                    callback(true, {result : "Ajout ok"});
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    createPlaylist (params, callback) {
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.insert({
                        name: params.body.name,
                        userId: currentUser,
                        musics : []
                    }, 'playlist').then(r => {
                        callback(true, {result: "Ajout ok"});
                    });
                    callback(false, {result: "Ajout nok"});
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

   addToPlaylist (params, callback) {
        CheckUser.getUser(params.body.authorization, (st, r)=> {
            var currentUser = r.result._id;

            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.update({userId : currentUser, _id : ObjectID.createFromHexString(params.body.id)}, {
                        $addToSet: {
                            //musics: params.body.music
                            musics : {
                                videoId : params.body.videoId,
                                title : params.body.title,
                                channel : params.body.channel,
                                thumbnails : params.body.thumbnails
                            }                            
                        }
                    }, {}, 'playlist');

                    callback(true, {result: "Ajout ok"});
                });
            } else {
                callback(false, {result : "Vous n'êtes pas connecté"});
            }
        });
    }

    getPlaylistOfUser (params, callback) {
        CheckUser.getUser(params.query.authorization, (st, r)=> {
            var currentUser = r.result._id;
            if(st) {
                Mongo.connect().then((q) => {
                    Mongo.find({userId : currentUser}, 'playlist').then(r => {
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
}

module.exports.MusicController = new MusicController();
