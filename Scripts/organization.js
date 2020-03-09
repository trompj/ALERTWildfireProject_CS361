// let responderURL = "http://localhost:39999/get-responders";
// let responderInsertURL = "http://localhost:39999/add-responder-location";
// let responderPutURL = "http://localhost:39999/put-responders";
// let deleteResponder = "http://localhost:39999/delete-responder";
// let serverURL = "http://localhost:39999/";

let responderURL = "http://flip1.engr.oregonstate.edu:39999/get-responders";
let responderPutURL = "http://flip1.engr.oregonstate.edu:39999/put-responders";
let deleteResponder = "http://flip1.engr.oregonstate.edu:39999/delete-responder";
let serverURL = "http://flip1.engr.oregonstate.edu:39999/";

document.addEventListener('DOMContentLoaded', fillResponderTable);
document.addEventListener('DOMContentLoaded', postResponder);

function fillResponderTable(event) {
    let getResponders = new XMLHttpRequest();

    getResponders.open("GET", responderURL, true);
    getResponders.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    getResponders.addEventListener('load', function() {
        if (getResponders.status >= 200 && getResponders.status < 400) {
            let getResponse = JSON.parse(getResponders.responseText);

            let table = document.getElementById("responder-table");

            for (let idx = 0; idx < getResponse.length; idx++) {
                //Add data for rows
                let tableRow = document.createElement('tr');

                let td = document.createElement('td');
                td.textContent = getResponse[idx].first_name;
                tableRow.appendChild(td);

                td = document.createElement('td');
                td.textContent = getResponse[idx].last_name;
                tableRow.appendChild(td);

                td = document.createElement('td');
                td.textContent = getResponse[idx].street1;
                tableRow.appendChild(td);

                td = document.createElement('td');
                td.textContent = getResponse[idx].street2;
                tableRow.appendChild(td);

                td = document.createElement('td');
                td.textContent = getResponse[idx].city;
                tableRow.appendChild(td);

                td = document.createElement('td');
                td.textContent = getResponse[idx].county;
                tableRow.appendChild(td);

                td = document.createElement('td');
                td.textContent = getResponse[idx].state;
                tableRow.appendChild(td);

                //Create buttons and hidden input with id.
                td = document.createElement('td');
                let form = document.createElement('form');

                let hiddenResponderId = document.createElement('input');
                hiddenResponderId.type = "hidden";
                hiddenResponderId.value = getResponse[idx].responder_id;
                form.appendChild(hiddenResponderId);

                let hiddenInput = document.createElement('input');
                hiddenInput.type = "hidden";
                hiddenInput.value = getResponse[idx].location_id;
                form.appendChild(hiddenInput);

                let editButton = document.createElement('button');
                let editTxt = document.createTextNode("Edit");
                editButton.addEventListener('click', function(event) {
                    editForm(hiddenInput, hiddenResponderId);

                    event.preventDefault();
                });
                editButton.appendChild(editTxt);
                form.appendChild(editButton);

                let deleteButton = document.createElement('button');
                let deleteTxt = document.createTextNode("Delete");
                deleteButton.addEventListener('click', function(event) {
                    deleteResponderRow(hiddenInput, hiddenResponderId);

                    event.preventDefault();
                });
                deleteButton.appendChild(deleteTxt);
                form.appendChild(deleteButton);

                td.appendChild(form);
                tableRow.appendChild(td);
                table.appendChild(tableRow);
            }
        }
        else {
            console.log("Error in network request: " + getResponders.statusText);
        }
    });

    getResponders.send();

    event.preventDefault();
}

//Edit row that edit button is in.
function editForm(hiddenInput, hiddenResponderId) {
    let form = hiddenInput.parentElement;
    let td = form.parentElement;
    let tr = td.parentElement;

    //Find all applicable nodes
    let firstNameNode = tr.firstChild;
    let lastNameNode = firstNameNode.nextSibling;
    let street1Node = lastNameNode.nextSibling;
    let street2Node = street1Node.nextSibling;
    let cityNode = street2Node.nextSibling;
    let countyNode = cityNode.nextSibling;
    let stateNode = countyNode.nextSibling;

    //Get value of nodes
    let responderIdVal = hiddenResponderId.value;
    let locationIdVal = hiddenInput.value;
    let firstNameVal = firstNameNode.textContent;
    let lastNameVal = lastNameNode.textContent;
    let street1Val = street1Node.textContent;
    let street2Val = street2Node.textContent;
    let cityVal = cityNode.textContent;
    let countyVal = countyNode.textContent;
    let stateVal = stateNode.textContent;

    //Add values to update/edit form and display pop-up form
    document.getElementById("first-name-edit").value = firstNameVal;
    document.getElementById("last-name-edit").value = lastNameVal;
    document.getElementById("street1-edit").value = street1Val;
    document.getElementById("street2-edit").value = street2Val;
    document.getElementById("city-edit").value = cityVal;
    document.getElementById("county-edit").value = countyVal;
    document.getElementById("state-edit").value = stateVal;
    document.getElementById("form-edit-overlay").style.display = "block";
    document.getElementById("overlay-background").style.display = "block";

    let submitEdit = function (event) {
        let editRow = new XMLHttpRequest();

        editRow.open("PUT", responderPutURL, true);
        editRow.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        let postBody = "locationId=" + locationIdVal + "&responderId=" + responderIdVal + "&firstName=" + document.getElementById("first-name-edit").value
            + "&lastName=" + document.getElementById("last-name-edit").value + "&street1=" +
            document.getElementById("street1-edit").value + "&street2=" +
            document.getElementById("street2-edit").value + "&city=" +
            document.getElementById("city-edit").value + "&county=" +
            document.getElementById("county-edit").value + "&state=" +
            document.getElementById("state-edit").value;

        editRow.addEventListener('load', function (event) {
            if (editRow.status >= 200 && editRow.status < 400) {
                let editResponse = JSON.parse(editRow.responseText);

                //Edit form contents on page after update
                firstNameNode.textContent = editResponse.firstName;
                lastNameNode.textContent = editResponse.lastName;
                street1Node.textContent = editResponse.street1;
                street2Node.textContent = editResponse.street2;
                cityNode.textContent = editResponse.city;
                countyNode.textContent = editResponse.county;
                stateNode.textContent = editResponse.state;

                //Hide pop-up edit form
                document.getElementById("form-edit-overlay").style.display = "none";
                document.getElementById("overlay-background").style.display = "none";

                document.getElementById("submit-edit").removeEventListener('click', submitEdit);
            }

            event.preventDefault();
        });

        editRow.send(postBody);

        event.preventDefault();
    };

    document.getElementById("submit-edit").addEventListener('click', submitEdit);
}

//Delete row that delete button is in.
function deleteResponderRow(hiddenInput, hiddenResponderId) {
    let deleteRow = new XMLHttpRequest();

    deleteRow.open("DELETE", deleteResponder, true);
    deleteRow.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    let locationIdVal = hiddenInput.value;
    let responderIdVal = hiddenResponderId.value;
    let postBody = "locationId=" + locationIdVal + "&responderId=" + responderIdVal;

    deleteRow.addEventListener('load', function() {
        if (deleteRow.status >= 200 && deleteRow.status < 400) {

            let form = hiddenInput.parentElement;
            let td = form.parentElement;
            let tr = td.parentElement;

            while (tr.firstChild) {
                tr.removeChild(tr.firstChild);
            }

            tr.remove();
        }
        else {
            console.log("Error in network request: " + deleteRow.statusText);
        }
    });

    deleteRow.send(postBody);
}

function postResponder() {
    document.getElementById('postResponder').addEventListener('click', function(event) {
        let postRequest = new XMLHttpRequest();

        let error = false;
        //Set all validation fields to default
        document.getElementById("first_name").style.borderColor = "black";
        document.getElementById("last_name").style.borderColor = "black";
        document.getElementById("state").style.borderColor = "black";
        document.getElementById("county").style.borderColor = "black";


        let first_name = document.getElementById('first_name').value;
        if (first_name === "") {
            document.getElementById("first_name").style.borderColor = "red";
            error = true;
        }

        let last_name = document.getElementById('last_name').value;
        if (last_name === "") {
            document.getElementById("last_name").style.borderColor = "red";
            error = true;
        }

        let city = document.getElementById('city').value;

        let state = document.getElementById('state').value;
        if (state === "") {
            document.getElementById("state").style.borderColor = "red";
            error = true;
        }

        let county = document.getElementById('county').value;
        if (county === "") {
            document.getElementById("county").style.borderColor = "red";
            error = true;
        }

        if (error !== true) {
            let street1 = document.getElementById('street1').value;
            let street2 = document.getElementById('street2').value;

            let postBody = "first_name=" + first_name + "&" + "last_name=" + last_name + "&" + "city=" + city +
                "&" + "state=" + state + "&" + "county=" + county + "&street1=" + street1 + "&street2=" + street2;

            let apiURL = serverURL + "add-responder-location";
            postRequest.open("POST", apiURL, true);
            postRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            postRequest.addEventListener('load', function () {
                if (postRequest.status >= 400) {
                    alert("Failed to add responder")
                }
            });

            postRequest.send(postBody);
        }
        else {
            event.preventDefault();
        }
    })
}
