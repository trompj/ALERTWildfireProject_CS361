let express = require('express');
let morgan = require('morgan');
let cors = require('cors');
let uuid = require('uuid/v4');
let session = require('express-session');
const bodyParser = require('body-parser');
let FileStore = require('session-file-store')(session);
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let axios = require('axios');
let handlebars = require('express-handlebars').create({defaultLayout:'home'});


let application = express();
application.use(morgan('combined'));


application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());
application.use(cors());

application.engine('handlebars', handlebars.engine);
application.set('view engine', 'handlebars');
application.set('port', 39999);

let mysql = require('mysql');

let pool = mysql.createPool({
   connectionLimit: 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_trompj',
    password        : '0613',
    database        : 'cs340_trompj'
});

application.post('/login', function(request, response, next) {
    let username = request.body.username;
    let password = request.body.password;

    pool.query('SELECT * FROM users', function (error, rows, fields) {
        let paramValues = {};
        let authenticated = false;

        let dataContent = {};

        dataContent.entityList = paramValues;

        if (error) {
            next(error);
            return;
        }

        let rowId = null;
        for (let row in rows) {
            if (rows[row].username === username && rows[row].password === password) {
                    authenticated = true;

                    rowId = rows[row].id;
            }
        }

        if (authenticated) {
            let tokenVal = uuid();

            pool.query("SELECT * FROM users WHERE id=?", [rowId], function(error, result) {

                pool.query("UPDATE users SET token=? WHERE id=? ",
                    [tokenVal, rowId],
                    function(error, result){

                    });

            });

            response.cookie("Access_Token", tokenVal);

            response.sendStatus(200);
        }
        else {
            response.sendStatus(400);
        }

    });
});

application.post('/add-stranding', function(request, response, next) {
    let city = request.body.city;
    let state = request.body.state;
    let county = request.body.county;
    let alive = request.body.alive;
    let longitude = request.body.longitude;
    let latitude = request.body.latitude;
    let mammalNote = request.body.mammalNote;
    let locationNote = request.body.locationNote;

    let strandingId = 0;
    let mammalId = 0;
    let locationId = 0;

    pool.query("INSERT INTO strandings (`alive`) VALUES (?)"
        , [alive], function (error, result) {
            if (error) {
                next(error);
                return;
            }

            let row = {
                "alive": alive,
            };

            strandingId = result.insertId;

            response.status(200).send();
    });

    pool.query("INSERT INTO mammals (`note`, `stranding_id`) VALUES (?, (SELECT stranding_id FROM strandings ORDER BY stranding_id DESC LIMIT 1))"
        , [mammalNote], function (error, result) {
            if (error) {
                next(error);
                return;
            }

            let row = {
                "note": mammalNote,
            };

            response.status(200).send();
    });

    pool.query("INSERT INTO locations (`city`, `state`, `county`, `longitude`, `latitude`, `note`, `stranding_id`) VALUES (?, ?, ?, ?, ?, ?, (SELECT stranding_id FROM strandings ORDER BY stranding_id DESC LIMIT 1))"
        , [city, state, county, alive, longitude, latitude, locationNote], function (error, result) {
        if (error) {
            next(error);
            return;
        }

        response.status(200).send();
    });
});

application.get('/reset-mammal-table',function(req,res,next){
    let context = {};
    pool.query("DROP TABLE IF EXISTS strandings", function(err){ //replace your connection pool with the your variable containing the connection pool
        let createString = "CREATE TABLE strandings("+
            "stranding_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,"+
            "location_note varchar(255),"+
            "alive boolean NOT NULL,"+
            "rehabilitated` boolean NOT NULL," +
            "active` boolean NOT NULL)";
        pool.query(createString, function(err){
            context.results = "Table reset";
            res.sendStatus(200);
        })
    });
});

application.post('/add-user', function(request, response, next) {
    let username = request.body.username;
    let password = request.body.password;
    let type = request.body.type;

    pool.query("INSERT INTO users (`username`, `password`, `type`) VALUES (?, ?, ?)", [username, password, type], function(error, result){
        if(error){
            next(error);
            return;
        }

        response.status(200).send();
    });
});

application.use(function(request,response){
    response.status(404);
    response.render('404');
});

application.use(function(error, request, response, next){
    console.error(error.stack);
    response.type('plain/text');
    response.status(500);
    response.render('500');
});

application.listen(application.get('port'), function(){
    console.log('Express started on http://localhost:' + application.get('port') + '; press Ctrl-C to terminate.');
});


//TABLE CREATIONS
// CREATE TABLE `strandings` (
//     `stranding_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     `location_note` varchar(255),
//     `alive` boolean NOT NULL,
//     `rehabilitated` boolean NOT NULL,
//     `active` boolean NOT NULL
// );
//
// CREATE TABLE `responders` (
//     `responder_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     `first_name` varchar(20),
//     `last_name` varchar(20)
// );
//
// CREATE TABLE `mammals` (
//     `mammal_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     `stranding_id` int(11),
//     `length` double,
//     `sex` char,
//     `note` varchar (255),
//     FOREIGN KEY(stranding_id) REFERENCES strandings(stranding_id)
// );
//
// CREATE TABLE `locations` (
//     `location_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     `responder_id` int(11),
//     `stranding_id` int(11),
//     `street1` varchar(20),
//     `street2` varchar(20),
//     `city` varchar(20),
//     `county` varchar (20) NOT NULL,
//     `state` varchar(2) NOT NULL,
//     `longitude` double,
//     `latitude` double,
//     `note` varchar(255),
//     FOREIGN KEY(stranding_id) REFERENCES strandings(stranding_id),
//     FOREIGN KEY(responder_id) REFERENCES responders(responder_id)
// );
