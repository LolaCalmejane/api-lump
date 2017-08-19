/**
 * Created by thomas on 04/08/2017.
 */
const {YouTubeService} = require('../services/youtube');
const {CheckUser} = require('../Model/CheckUser');
const {Mongo} = require('../services/Mongo');

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
                                channel : params.body.channel
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
}

module.exports.MusicController = new MusicController();
