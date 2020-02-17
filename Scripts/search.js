let getStrandingURL = "http://localhost:39999/get-stranding";
let updateStrandingURL = "http://localhost:39999/put-stranding";
let addMammalURL = "http://localhost:39999/add-mammal";

//let getStrandingURL = "http://flip1.engr.oregonstate.edu:39999/get-stranding";
//let updateStrandingURL = "http://flip1.engr.oregonstate.edu:39999/put-stranding";
//let addMammalURL = "http://flip1.engr.oregonstate.edu:39999/add-mammal";

document.getElementById('update-stranding').addEventListener('click', editStrandingForm);
document.getElementById('add-mammal').addEventListener('click', addMammalForm);

//Edit row that edit button is in.
function editStrandingForm() {
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
            document.getElementById("active-edit").value = getResponse[0].active;
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

                editRow.open("PUT", updateStrandingURL, true);
                editRow.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                let postBody = "locationId=" + locationId + "&strandingId=" + strandingId + "&active=" +
                    document.getElementById("active-edit").value +
                    "&latitude=" + document.getElementById("latitude-edit").value +
                    "&longitude=" + document.getElementById("longitude-edit").value +
                    "&street1=" + document.getElementById("street1-edit").value +
                    "&street2=" + document.getElementById("street2-edit").value +
                    "&city=" + document.getElementById("city-edit").value +
                    "&county=" + document.getElementById("county-edit").value +
                    "&state=" + document.getElementById("state-edit").value;

                editRow.addEventListener('load', function(event) {
                    if (editRow.status >= 200 && editRow.status < 400) {
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
    });

    getStranding.send();

    event.preventDefault();
}

//Add a mammal to an active stranding.
function addMammalForm(event) {
    //Get the stranding
    let strandingId = document.getElementById("addMammalStrandingId").value;

    let getStranding = new XMLHttpRequest();

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
                let rehabilitated = document.getElementById("rehabilitated-edit").value;
                let alive = document.getElementById("alive-edit").value;
                let note = document.getElementById("note-edit").value;

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
    });

    getStranding.send();

    event.preventDefault();
}