/**
 * Created by thomas on 04/08/2017.
 */
const {YouTubeService} = require('../services/youtube');
const {Mongo} = require('../services/Mongo');
const ObjectID = require('mongodb').ObjectID;

class MusicController {
    constructor () {
    }

    search (params, callback) {
        params.type = params.type || 'video';
        params.limit = params.limit || 6;
        YouTubeService.searchVideo(params.search,params.type, callback, params.limit);
    }

    addToMusics (params, callback) {
        Mongo.connect().then((q) => {
            Mongo.update({_id : params.currentUser}, {$addToSet :
                {
                    musics : {
                        videoId : params.body.videoId,
                        title : params.body.title,
                        channel : params.body.channel,
                        thumbnails : params.body.thumbnails,
                        duration : params.body.duration
                    }
                }
            },{}, 'user');
            callback(true, {result : "Ajout ok"});
        });
    }

    deleteMusic (params, callback) {
        Mongo.connect().then((q) => {
            switch (params.params.type) {
                case 'music':
                    Mongo.update({
                        _id: params.currentUser
                    }, {
                        $pull: {
                            musics: {videoId: params.body.videoId}
                        }
                    }, {}, 'user');
                    break;
                case 'playlist':
                    Mongo.remove({
                        userId: params.currentUser,
                        _id: ObjectID.createFromHexString(params.body.id)
                    }, 'playlist');
                    break;
                case 'playlistMusic':
                    Mongo.update({
                        userId: params.currentUser,
                        _id: ObjectID.createFromHexString(params.body.id)
                    }, {
                        $pull: {
                            musics: params.body.videoId
                        }
                    }, {}, 'playlist');
                    break;

            }
            callback(true, {result: "Delete ok"});
        });
    }

    createPlaylist (params, callback) {
        Mongo.connect().then((q) => {
            Mongo.insert({
                name: params.body.name,
                userId: params.currentUser,
                musics : []
            }, 'playlist').then(r => {
                callback(true, {result: "Ajout ok"});
            });
            callback(false, {result: "Ajout nok"});
        });
    }

    addToPlaylist (params, callback) {
        Mongo.connect().then((q) => {
            Mongo.update({userId : params.currentUser, _id : ObjectID.createFromHexString(params.body.id)}, {
                $addToSet: {
                    musics: params.body.music
                }
            }, {}, 'playlist');
            callback(true, {result: "Ajout ok"});
        });
    }

    getPlaylistOfUser (params, callback) {
        Mongo.connect().then((q) => {
            Mongo.find({userId : params.currentUser}, 'playlist').then(r => {
                callback(true, r);
            }).catch(r => {
                callback(false, r);
            })
        });
    }

    getSinglePlaylist (params, callback) {
        Mongo.connect().then((q) => {
            Mongo.findOne({userId : ObjectID.createFromHexString(params.body.id)}, 'playlist').then(r => {
                callback(true, r);
            }).catch(r => {
                callback(false, r);
            })
        });
    }
}

module.exports.MusicController = new MusicController();