/**
 * Created by thomas on 29/07/2017.
 */

const express = require('express')
const app = express()
const {ProfilController} = require('./controlleurs/ProfilController');
const bodyParser = require('body-parser');

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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
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
app.put(API+'user/create', (req, res) => {
    ProfilController.create(req.body, r => {
        //res.cookie('lump', )
        responseBody.success = true;
        res.send(responseBody);
    });
});

/**
 * @api /user/login
 */
app.get(API+'user/login', (req, res) => {
    ProfilController.login(req.query, (s,r) => {
        if(s) {
            responseBody.success = true;
            res.send(responseBody);
        }
        responseBody.success = false;
        responseBody.result.message = r;
        res.send(responseBody);
    });
});

app.get(API+'user/search', (req, res) => {
    console.log(req.body, req.params, req.query);
    ProfilController.search(req.query, (s,r) => {
        if(s) {
            responseBody.success = true;
            responseBody.result = r;
            res.send(responseBody);
        }
        responseBody.success = false;
        responseBody.result.message = r;
        res.send(responseBody);
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
