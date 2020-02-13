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

    //Insert stranding row
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

            //Insert location row with FK ID for stranding
            pool.query("INSERT INTO locations (`city`, `state`, `county`, `longitude`, `latitude`, `note`, `stranding_id`) VALUES (?, ?, ?, ?, ?, ?, ?)"
                , [city, state, county, longitude, latitude, locationNote, strandingId], function (error, result) {
                    if (error) {
                        next(error);
                        return;
                    }

                    locationId = result.insertId;

                    response.status(200).send();

                    //Update stranding with FK ID for location
                    pool.query("UPDATE strandings SET location_id=? WHERE stranding_id=? ",
                        [locationId, strandingId],
                        function (error, result) {
                            if (error) {
                                next(error);
                                return;
                            }

                            response.status(200).send();
                        });
                });
        });

    //Insert mammal row
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

application.put('/put-responders',function(request,response,next){
    let responderId = request.body.responderId;
    let locationId = request.body.locationId;
    let respondeBody;

    pool.query("UPDATE responders SET first_name=?, last_name=? WHERE responder_id=? ",
        [request.body.firstName, request.body.lastName, responderId],
        function (error, result) {
            if (error) {
                next(error);
                return;
            }

            pool.query("UPDATE locations SET street1=?, street2=?, city=?, county=?, state=? WHERE location_id=? ",
                [request.body.street1, request.body.street2, request.body.city, request.body.county,
                    request.body.state, locationId],
                function (error, result) {
                    if (error) {
                        next(error);
                        return;
                    }

                    responseBody = {
                        "firstName": request.body.firstName,
                        "lastName": request.body.lastName,
                        "street1": request.body.street1,
                        "street2": request.body.street2,
                        "city": request.body.city,
                        "county": request.body.county,
                        "state": request.body.state
                    };

                    response.status(200).send(JSON.stringify(responseBody));
                });
     });
});

// application.use(function(request,response){
//     response.status(404);
//     response.render('404');
// });
//
// application.use(function(error, request, response, next){
//     console.error(error.stack);
//     response.type('plain/text');
//     response.status(500);
//     response.render('500');
// });

application.listen(application.get('port'), function(){
    console.log('Express started on http://localhost:' + application.get('port') + '; press Ctrl-C to terminate.');
});

//Get all responders and corresponding location information
application.get('/get-responders', function(request, response, next) {
    pool.query('SELECT * FROM responders LEFT JOIN locations ON responders.location_id = locations.location_id', function (error, rows, fields) {

        if (error) {
            next(error);
            return;
        }

        response.status(200).send(rows);
    });
});

//Get all locations of strandings
application.get('/get-stranding-locations', function(request, response, next) {
    pool.query('SELECT * FROM locations', function (error, rows, fields) {

        if (error) {
            next(error);
            return;
        }

        response.status(200).send(rows);
    });
});
