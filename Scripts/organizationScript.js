let responderURL = "http://localhost:39999/get-responders";
//let url = "http://flip3.engr.oregonstate.edu:36999/";

document.addEventListener('DOMContentLoaded', fillResponderTable);

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

                let hiddenInput = document.createElement('input');
                hiddenInput.type = "hidden";
                hiddenInput.value = getResponse[idx].responder_id;
                form.appendChild(hiddenInput);

                let editButton = document.createElement('button');
                let editTxt = document.createTextNode("Edit");
                editButton.addEventListener('click', function(event) {
                    editForm(hiddenInput);

                    event.preventDefault();
                });
                editButton.appendChild(editTxt);
                form.appendChild(editButton);

                let deleteButton = document.createElement('button');
                let deleteTxt = document.createTextNode("Delete");
                deleteButton.addEventListener('click', function(event) {
                    deleteRow(hiddenInput);

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