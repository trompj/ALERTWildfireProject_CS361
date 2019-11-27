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

//POST username/password to server for authentication.
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

        //If username/password combination is authenticated
        if (authenticated) {
            //User is succesfully authenticated, set session state.
            sessionStorage.setItem("AuthenticationState", "Authenticated");

            authenticatedPage();
        }
        else {
            notAuthenticatedPage();
        }
    });

    findUser.send(body);
}

//Move to login page
function notAuthenticatedPage() {
    window.location = "login.html";
}

//Move to homepage
function authenticatedPage() {
    window.location.href = "home.html";
}

function addCurrentUser(user, pass, typeVal) {
    currentUser.push({username: user, password: pass, type: typeVal})
}

function authenticateSession() {
    if (sessionStorage.getItem('AuthenticationState') === null) {
        notAuthenticatedPage();
    }
}