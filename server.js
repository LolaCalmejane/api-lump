/**
 * Created by thomas on 29/07/2017.
 */

const express = require('express');
const app = express();
const {ProfilController} = require('./controlleurs/ProfilController');
const {FriendController} = require('./controlleurs/FriendController');
const {MusicController} = require('./controlleurs/MusicController');
const {EventController} = require('./controlleurs/EventController');

const {CheckUser} = require('./Model/CheckUser');

const bodyParser = require('body-parser');
const CONFIG = require('./const');

const http = require('http');
const socket = http.createServer();
const io = require('socket.io').listen(socket);
socket.listen(7000, "0.0.0.0");

let API = "/api/1.0/";
let responseBody = {
    success : 0,
    result : {},
    error : ""
}

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', CONFIG.AUTHURL);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

async function checkUser(authorization) {
    let user;
    try {
        user = await new Promise((resolve, rej) => {
            CheckUser.getUser(authorization, (st, r)=> {
                if (st) {
                    return resolve(r);
                }
                rej();
            });
        });
    } catch (e) {
        return false;
    }
    return user;
}

app.get('/', function (req, res) {
    res.send('Hello World!')
});

/**
 * @api /user/creation
 */
app.post(API+'user/create', (req, res) => {
    ProfilController.create(req.body, (st,r) => {
        //res.cookie('lump', )
        responseBody.success = st;
        responseBody.result = r.result;
        res.send(responseBody);
    });
});

/**
 * @api /user/login
 */
app.get(API+'user/login', (req, res) => {
    ProfilController.login(req.query, (s,r) => {
        res.send({success : s, result : r.result});
    });
});

app.get(API+'user/search', (req, res) => {
    ProfilController.search(req.query, (s,r) => {
        if(s) {
            return res.send({success : s, result : r.result});
        }
        res.send({success : s, result : r.result});
    });
});

/**
 * param login : alias of the user
 */
app.get(API+'user/getprofil', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        ProfilController.getProfil(req, (s,r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.post(API+'friend/add/:user', (req, res) => {
    FriendController.addFriend(req, (s,r) => {
        res.send(r);
    });
});

app.get(API+'friend/list/', (req, res) => {
    FriendController.getFriends(req.query, (s,r) => {
        res.send(r);
    });
});

app.post(API+'friend/delete/:id', (req, res) => {
    FriendController.deleteFriend(req, (s,r) => {
        res.send(r);
    });
});

app.get(API+'music/search', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.search(req.query, (s,r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.post(API+'music/add/music', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.addToMusics(req, (s,r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.post(API+'music/playlist/create', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.createPlaylist(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.post(API+'music/playlist/add', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.addToPlaylist(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.get(API+'music/playlist/list', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.getPlaylistOfUser(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

/**
 * param id id of the playlist
 */
app.get(API+'music/playlist/single', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.getSinglePlaylist(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});


/**
 *  @param type : music, playlist, playlistMusic
 *  @param videoId : the youtube Id of the music
 *  @param id : The id of the playlist
 */
app.post(API+'music/delete/:type', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        MusicController.deleteMusic(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.post(API+'event/create', async (req, res) => {
    EventController.createEvent(req, (s, r) => {
        res.send(r);
    });
});

app.post(API+'event/add', (req, res) => {
    EventController.addMusicToEvent(req, (s, r) => {
        res.send(r);
    });
});

app.post(API+'event/addParticipant', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        EventController.addParticipantToEvent(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.post(API+'event/addRanking', (req, res) => {
    EventController.addRankingToMusic(req, (s, r) => {
        res.send(r);
    });
});

app.get(API+'event/list', (req, res) => {
    EventController.getEventOfUser(req, (s, r) => {
        res.send(r);
    });
});

/**
 * id event id
 */
app.get(API+'event/disconnect', (req, res) => {
    EventController.getEventForDisconnectedUser(req, (s, r) => {
        res.send(r);
    });
});

/**
 * param id event id
 */
app.get(API+'event/single', async (req, res) => {
    let user = await checkUser(req.body.authorization || req.query.authorization);
    if (user) {
        req.currentUser = user.result._id;
        EventController.getEventForDisconnectedUser(req, (s, r) => {
            res.send(r);
        });
        return;
    }
    res.send({result : "Vous n'êtes pas connecté"});
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});

io.on('connection', socket =>{
    console.log('a user connected');
    socket.on('connection name',function(user){
        io.sockets.emit('new user', user.name + " has joined.");
    })
    socket.on('message', msg => {
        var req = {};
        req.params = "main/socket";
        var response = factory.init(req);
        console.log(msg);
        socket.broadcast.send(response);
    });
});
