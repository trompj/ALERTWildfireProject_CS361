let url = "http://localhost:39999";

/*
Database Username/Password Combinations
    {
        username: "public",
        password: "password",
        type: "public"
    },
    {
        username: "official",
        password: "password_official",
        type: "first_responder"
    }
*/

let currentUser = [];

let authenticated = false;

function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    loginAuthenticate(username, password);
}

function loginAuthenticate(username, password) {
    authenticated = false;

    let findUser = new XMLHttpRequest();

    findUser.open("POST", (url + "/login"), true);
    findUser.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    let body = "username=" + username + "&" + "password=" + password;
    findUser.addEventListener('load', function(event) {
        if (findUser.status >= 200 && findUser.status < 400) {
            authenticated = true;
        }
        else {
            console.log("Error in network request: " + findUser.statusText);
        }

        event.preventDefault();

        if (authenticated) {
            authenticatedPage();
        }
        else {
            notAuthenticatedPage();
        }
    });

    findUser.send(body);
}

function notAuthenticatedPage() {
    window.location = "login.html";
}

function authenticatedPage() {
    window.location.href = "home.html";
}

function addCurrentUser(user, pass, typeVal) {
    currentUser.push({username: user, password: pass, type: typeVal})
}