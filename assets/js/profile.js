let data;

function FETCH_USER_PROFILE(){
    var request = indexedDB.open("ace-it");
    request.onsuccess = function(){
        var trx = request.result.transaction("user_data") || "";
        var objectStore = trx.objectStore("user_data");
        var userData = objectStore.getAll();

        userData.onsuccess = async function(ev) {
            data = await ev.target.result;
            document.querySelector(".user-profile").innerHTML = `
                <img src="" alt="User PFP" width="200"/>
                <h5>${data[0].userName}</h5>
            `
        };
    };
};

function VIEW_PROFILE() {
    //todo: convert dob
    CREATE_MODAL(`
        <form id="user-profile-form" autocomplete="off">
            <h4>MY PROFILE</h4>
            <div class='field'>
                <span class='label'>USERNAME</span>
                <input type='text' id='uname' value='${data[0].userName}'/>
            </div>

            <div class='field'>
                <span class='label'>FULL NAME</span>
                <input type='text' id='fname' value='${data[0].fullName}'/>
            </div>

            <div class='field'>
                <span class='label'>SEX</span>
                <input type='text' id='gender' value='${data[0].gender}'/>
            </div>

            <div class='field'>
                <span class='label'>DATE OF BIRTH</span>
                <input type='date' id='dob' value='${data[0].dob}'/>
            </div>
        </form>    
    `);
};

FETCH_USER_PROFILE();