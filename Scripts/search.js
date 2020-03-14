// let getStrandingURL = "http://localhost:39999/get-stranding";
// let updateStrandingURL = "http://localhost:39999/put-stranding";
// let addMammalURL = "http://localhost:39999/add-mammal";
// let strandingsRespondersURL = "http://localhost:39999/get-strandings-responders";
//let serverURL = "http://localhost:39999/";

let getStrandingURL = "http://flip1.engr.oregonstate.edu:39999/get-stranding";
let updateStrandingURL = "http://flip1.engr.oregonstate.edu:39999/put-stranding";
let addMammalURL = "http://flip1.engr.oregonstate.edu:39999/add-mammal";
let searchMammalsURL = "http://flip1.engr.oregonstate.edu:39999/get-mammals";
let strandingsRespondersURL = "http://flip1.engr.oregonstate.edu:39999/get-strandings-responders";
let serverURL = "http://flip1.engr.oregonstate.edu:39999/";

document.getElementById('update-stranding').addEventListener('click', editStrandingForm);
document.getElementById('add-mammal').addEventListener('click', addMammalForm);
document.addEventListener('DOMContentLoaded', populateDropdown);
document.addEventListener('DOMContentLoaded', searchMammalsPopup);
document.addEventListener('DOMContentLoaded', searchStrandingsPopup);
document.addEventListener('DOMContentLoaded', postStrandingsResponders);
document.getElementById('removeResponder').addEventListener('click', removeResponder);
document.getElementById('removeStranding').addEventListener('click', removeStranding);

//Edit row that edit button is in.
function editStrandingForm(event) {
    //Get the stranding
    let strandingId = document.getElementById("strandingId").value;

    let getStranding = new XMLHttpRequest();

    let getRequestURL = getStrandingURL + "?strandingId=" + strandingId;
    getStranding.open("GET", getRequestURL, true);
    getStranding.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    getStranding.addEventListener('load', function() {
        if (getStranding.status >= 200 && getStranding.status < 400) {
            let getResponse = JSON.parse(getStranding.responseText);
            let locationId = getResponse[0].location_id;

            //Add values to update/edit form and display pop-up form
            if (getResponse[0].active === 1) {
                document.getElementById("active-edit").checked = true;
            }
            else {
                document.getElementById("active-edit").checked = false;
            }
            document.getElementById("street1-edit").value = getResponse[0].street1;
            document.getElementById("street2-edit").value = getResponse[0].street2;
            document.getElementById("city-edit").value = getResponse[0].city;
            document.getElementById("county-edit").value = getResponse[0].county;
            document.getElementById("state-edit").value = getResponse[0].state;
            document.getElementById("latitude-edit").value = getResponse[0].latitude;
            document.getElementById("longitude-edit").value = getResponse[0].longitude;
            document.getElementById("form-edit-overlay").style.display = "block";
            document.getElementById("overlay-background").style.display = "block";

            let submitEdit = function (event) {
                let editRow = new XMLHttpRequest();
                let error = false;

                document.getElementById("longitude-edit").style.borderColor = "black";
                document.getElementById("latitude-edit").style.borderColor = "black";
                document.getElementById("state-edit").style.borderColor = "black";
                document.getElementById("county-edit").style.borderColor = "black";

                editRow.open("PUT", updateStrandingURL, true);
                editRow.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                let active = document.getElementById("active-edit").checked;
                if (active === false) {
                    active = 0;
                }
                else {
                    active = 1;
                }

                let longitude = document.getElementById("longitude-edit").value;
                if (longitude < -180 || longitude > 180) {
                    document.getElementById("longitude-edit").style.borderColor = "red";
                    error = true;
                }

                let latitude = document.getElementById("latitude-edit").value;
                if (latitude < -90 || latitude > 90) {
                    document.getElementById("latitude-edit").style.borderColor = "red";
                    error = true;
                }

                let state = document.getElementById("state-edit").value;
                if (state === "" || state == null) {
                    document.getElementById("state-edit").style.borderColor = "red";
                    error = true;
                }

                let county = document.getElementById("county-edit").value;
                if (county === "" || county == null) {
                    document.getElementById("county-edit").style.borderColor = "red";
                    error = true;
                }

                if (error === false) {
                    let postBody = "locationId=" + locationId + "&strandingId=" + strandingId + "&active=" +
                        active + "&latitude=" + latitude + "&longitude=" + longitude +
                        "&street1=" + document.getElementById("street1-edit").value +
                        "&street2=" + document.getElementById("street2-edit").value +
                        "&city=" + document.getElementById("city-edit").value +
                        "&county=" + county + "&state=" + state;

                    editRow.addEventListener('load', function (event) {
                        if (editRow.status >= 200 && editRow.status < 400) {
                            //Hide pop-up edit form
                            document.getElementById("form-edit-overlay").style.display = "none";
                            document.getElementById("overlay-background").style.display = "none";

                            document.getElementById("submit-edit").removeEventListener('click', submitEdit);
                        }

                        event.preventDefault();
                    });

                    editRow.send(postBody);
                }

                event.preventDefault();
            };

            document.getElementById("submit-edit").addEventListener('click', submitEdit);
        }
        else {
            alert("Stranding ID Not Found")
        }
    });

    getStranding.send();

    event.preventDefault();
}

//Add a mammal to an active stranding.
function addMammalForm(event) {
    //Get the stranding
    let strandingId = document.getElementById("addMammalStrandingId").value;

    let getStranding = new XMLHttpRequest();
    let get = getStrandingURL + "?strandingId";

    let getRequestURL = getStrandingURL + "?strandingId=" + strandingId;
    getStranding.open("GET", getRequestURL, true);
    getStranding.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    getStranding.addEventListener('load', function() {
        if (getStranding.status >= 200 && getStranding.status < 400) {

            let postMammal = new XMLHttpRequest();

            document.getElementById("mammal-form-edit-overlay").style.display = "block";
            document.getElementById("overlay-background").style.display = "block";

            let submitMammalEdit = function (event) {
                postMammal.open("POST", addMammalURL, true);
                postMammal.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                //Add values to update/edit form and display pop-up form
                let length = document.getElementById("length-edit").value;
                let sex = document.getElementById("sex-edit").value;
                let rehabilitated = document.getElementById("rehabilitated-edit").checked;
                let alive = document.getElementById("alive-edit").checked;
                let note = document.getElementById("note-edit").value;

                if (rehabilitated === true) {
                    rehabilitated = 1;
                }
                else {
                    rehabilitated = 0;
                }

                if (alive === true) {
                    alive = 1;
                }
                else {
                    alive = 0;
                }

                let postBody = "strandingId=" + strandingId + "&length=" + length + "&sex=" +
                    sex + "&rehabilitated=" + rehabilitated + "&alive=" + alive +
                    "&note=" + note;

                postMammal.addEventListener('load', function () {
                    if (postMammal.status >= 200 && postMammal.status < 400) {

                        //Hide pop-up edit form
                        document.getElementById("mammal-form-edit-overlay").style.display = "none";
                        document.getElementById("overlay-background").style.display = "none";

                        document.getElementById("submit-mammal-edit").removeEventListener('click', submitMammalEdit);
                    }
                });

                event.preventDefault();

                postMammal.send(postBody);
            };

            document.getElementById("submit-mammal-edit").addEventListener('click', submitMammalEdit);
        }
        else {
            alert("Stranding ID Not Found")
        }
    });

    getStranding.send();

    event.preventDefault();
}

function searchMammalsPopup(event) {

    document.getElementById('findStranding').addEventListener('click', function(event) {

        let strandingId = document.getElementById("strandingMammalId").value;

        let getMammals = new XMLHttpRequest();

        let URL = serverURL + "get-mammals" + "?strandingId=" + strandingId;
        getMammals.open("GET", URL, true);
        getMammals.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        getMammals.addEventListener('load', function() {

            if (getMammals.status >= 200 && getMammals.status < 400) {
                let getResponse = JSON.parse(getMammals.responseText);

                let table = document.getElementById("mammal-table");

                for (let idx = 0; idx < getResponse.length; idx++) {
                    //Add data for rows
                    let tableRow = document.createElement('tr');

                    let td = document.createElement('td');
                    td.textContent = getResponse[idx].mammal_id;
                    tableRow.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = getResponse[idx].length;
                    tableRow.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = getResponse[idx].sex;
                    tableRow.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = getResponse[idx].alive;
                    tableRow.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = getResponse[idx].rehabilitated;
                    tableRow.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = getResponse[idx].note;
                    tableRow.appendChild(td);

                    table.appendChild(tableRow);

                    document.getElementById("closeMammals").addEventListener('click', function(event) {
                        let rows = table.rows;
                        for (let i = 1; i < rows.length; i++) {
                            table.deleteRow(i);
                        }
                        document.getElementById("search-mammal-overlay").style.display = "none";
                        document.getElementById("overlay-background").style.display = "none";
                    })
                }

                document.getElementById("search-mammal-overlay").style.display = "block";
                document.getElementById("overlay-background").style.display = "block";
            }
            else {
                console.log("Error in network request: " + getMammals.statusText);
                alert("Stranding ID Not Found");
            }
        });

        getMammals.send();

        event.preventDefault();
    })
}

function searchStrandingsPopup(event) {

    document.getElementById('searchStrandings').addEventListener('click', function(event) {

        let responder = document.getElementById("responders").value;

        let getStrandings = new XMLHttpRequest();

        let URL = strandingsRespondersURL + "?responderId=" + responder;
        getStrandings.open("GET", URL, true);
        getStrandings.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        getStrandings.addEventListener('load', function() {

            if (getStrandings.status >= 200 && getStrandings.status < 400) {
                let getResponse = JSON.parse(getStrandings.responseText);

                let table = document.getElementById("strandings-responders-table");

                for (let idx = 0; idx < getResponse.length; idx++) {
                    //Add data for rows
                    let tableRow = document.createElement('tr');

                    let td = document.createElement('td');
                    td.textContent = getResponse[idx].responder_id;
                    tableRow.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = getResponse[idx].stranding_id;
                    tableRow.appendChild(td);

                    table.appendChild(tableRow);

                    document.getElementById("closeStrandings").addEventListener('click', function(event) {
                        let rows = table.rows;
                        for (let i = 1; i < rows.length; i++) {
                            table.deleteRow(i);
                        }
                        document.getElementById("strandings-responders-overlay").style.display = "none";
                        document.getElementById("overlay-background").style.display = "none";
                    })
                }

                //If no rows are present, allow close button to work without deleting rows
                if (getResponse.length === 0) {
                    document.getElementById("closeStrandings").addEventListener('click', function(event) {
                        document.getElementById("strandings-responders-overlay").style.display = "none";
                        document.getElementById("overlay-background").style.display = "none";
                    });
                }
            }
            else {
                console.log("Error in network request: " + getStrandings.statusText);
            }

            document.getElementById("strandings-responders-overlay").style.display = "block";
            document.getElementById("overlay-background").style.display = "block";
        });

        getStrandings.send();

        event.preventDefault();
    })
}

function postStrandingsResponders(event) {
    document.getElementById('addResponder').addEventListener('click', function(event) {
        let postRequest = new XMLHttpRequest();

        let dropdown = document.getElementById("strandings");
        let responderId = dropdown.options[dropdown.selectedIndex].value;
        let strandingId = document.getElementById('strandingIdInput').value;

        let postBody = "responderId=" + responderId + "&" + "strandingId=" + strandingId;

        let apiURL = serverURL + "add-strandings-responders";
        postRequest.open("POST", apiURL, true);
        postRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        postRequest.addEventListener('load', function() {
            if (postRequest.status >= 200 && postRequest.status < 400) {
                alert("Responder was successfully added to stranding.")
            }
        });

        postRequest.send(postBody);

        event.preventDefault();
    })
}

function populateDropdown(event) {
    let getResponders = new XMLHttpRequest();
    let getResponderNamesURL = serverURL + "get-responders-names";
    getResponders.open("GET", getResponderNamesURL, true);
    getResponders.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    getResponders.addEventListener('load', function() {
        if (getResponders.status >= 200 && getResponders.status < 400) {
            let getResponse = JSON.parse(getResponders.responseText);

            var dropdown1 = document.getElementById("responders");
            var dropdown2 = document.getElementById("strandings");

            // Loop through the list returned by SELECT query
            for (var i = 0; i < getResponse.length; ++i) {
                dropdown1[dropdown1.length] = new Option(getResponse[i].first_name + " " +
                    getResponse[i].last_name, getResponse[i].responder_id);
                dropdown2[dropdown2.length] = new Option(getResponse[i].first_name + " " +
                    getResponse[i].last_name, getResponse[i].responder_id);
            }
        }
    });

    getResponders.send();

    event.preventDefault();
}

function removeResponder(event) {
    let removeResponderURL = serverURL + "remove-responder-stranding";
    let deleteRow = new XMLHttpRequest();

    deleteRow.open("DELETE", removeResponderURL, true);
    deleteRow.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    let body = "strandingId=" + document.getElementById('strandingIdInput').value + "&responderId=" +
        document.getElementById("strandings").value;

    deleteRow.addEventListener('load', function() {
        if (deleteRow.status >= 200 && deleteRow.status < 400) {
            alert("Responder " + document.getElementById("strandings").value + " removed from stranding if exists.");
        }
        else {
            alert("Unable to remove responder from stranding. Responder may not be associated with stranding.");
        }
    });

    deleteRow.send(body);

    event.preventDefault();
}

function removeStranding(event) {
    let removeStrandingURL = serverURL + "delete-stranding";
    let deleteRow = new XMLHttpRequest();

    deleteRow.open("DELETE", removeStrandingURL, true);
    deleteRow.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    let body = "strandingId=" + document.getElementById('strandingId').value;

    deleteRow.addEventListener('load', function() {
        if (deleteRow.status >= 200 && deleteRow.status < 400) {
            alert("Stranding " + document.getElementById('strandingId').value + " removed");
        }
        else {
            alert("Unable to remove stranding. Stranding may not exist.");
        }
    });

    deleteRow.send(body);

    event.preventDefault();
}