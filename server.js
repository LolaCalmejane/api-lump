/**
 * Created by thomas on 29/07/2017.
 */

const express = require('express')
const app = express()
const {ProfilController} = require('./controlleurs/ProfilController');
const {FriendController} = require('./controlleurs/FriendController');
const {MusicController} = require('./controlleurs/MusicController');
const {EventController} = require('./controlleurs/EventController');
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
        responseBody.success = s;
        responseBody.result = r.result;
        res.send(responseBody);
    });
});

app.get(API+'user/search', (req, res) => {
    ProfilController.search(req.query, (s,r) => {
        if(s) {
            responseBody.success = true;
            responseBody.result = r;
            res.send(responseBody);
        }
        responseBody.success = false;
        responseBody.result = r.result;
        res.send(responseBody);
    });
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

app.get(API+'music/search', (req, res) => {
    MusicController.search(req.query, (s,r) => {
        res.send(r);
    });
});

app.post(API+'music/add/music', (req, res) => {
    MusicController.addToMusics(req, (s,r) => {
        res.send(r);
    });
});

app.post(API+'music/playlist/create', (req, res) => {
    MusicController.createPlaylist(req, (s, r) => {
        res.send(r);
    });
});

app.post(API+'music/playlist/add', (req, res) => {
    MusicController.addToPlaylist(req, (s, r) => {
        res.send(r);
    });
});

app.get(API+'music/playlist/list', (req, res) => {
    MusicController.getPlaylistOfUser(req, (s, r) => {
        res.send(r);
    });
});


app.post(API+'event/create', (req, res) => {
    EventController.createEvent(req, (s, r) => {
        res.send(r);
    });
});

app.post(API+'event/add', (req, res) => {
    EventController.addMusicToEvent(req, (s, r) => {
        res.send(r);
    });
});

app.post(API+'event/addParticipant', (req, res) => {
    EventController.addParticipantToEvent(req, (s, r) => {
        res.send(r);
    });
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

app.get(API+'event/disconnect', (req, res) => {
    EventController.getEventForDisconnectedUser(req, (s, r) => {
        res.send(r);
    });
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
