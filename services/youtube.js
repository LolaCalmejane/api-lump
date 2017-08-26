/**
 * Created by thomas on 04/08/2017.
 */
const request = require('request');
const APIKEY = "AIzaSyBHh98RBg7JmbuGfuIVITP1uJRfAAiKspM";

class YouTubeService {
    constructor () {
    }

    static searchVideo (search, type = "video", callback, limit = 6)
    {
        var url = 'https://www.googleapis.com/youtube/v3/search';
        var params = '?videoEmbeddable=true&order=viewCount&part=snippet&maxResults='+limit+'&q='+search+'&key='+APIKEY+'&type='+type;
        request(url+params, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                var final = [];
                var result = JSON.parse(body);
                for(var i =0; i < result.items.length; i++) {
                    final[i] = {
                        videoId : result.items[i].id.videoId,
                        title : result.items[i].snippet.title,
                        channel : result.items[i].snippet.channelTitle,
                        thumbnail : result.items[i].snippet.thumbnails.default.url
                    };
                }
                callback(true, {result : final});
            } else {
                callback(false, {error : "Error "+res.statusCode+" "+err});
            }
        });
    }
}

module.exports.YouTubeService = YouTubeService;
