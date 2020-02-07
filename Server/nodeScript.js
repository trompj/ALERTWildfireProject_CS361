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

application.get('/reset-table',function(req,res,next){
    let context = {};
    pool.query("DROP TABLE IF EXISTS users", function(err){ //replace your connection pool with the your variable containing the connection pool
        let createString = "CREATE TABLE users("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "username VARCHAR(255) NOT NULL,"+
            "password VARCHAR(255) NOT NULL,"+
            "type VARCHAR(255))";
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
