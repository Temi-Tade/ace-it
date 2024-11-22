let index = 0;
let isEdit = false;
let card;
var flashcardData = sessionStorage.getItem("ace-it temp data") ? JSON.parse(sessionStorage.getItem("ace-it temp data")) : {
    name: "",
    desc : "",
    flashcards: [],
    number: 0,
    id : crypto.randomUUID(),
    created : new Date().toUTCString(),
};

const TOGGLE_FORMS = (e, el, other) => {
    e.preventDefault();
    
    var trx = request.result.transaction("flashcards", "readwrite");
    var flashcardObjStore = trx.objectStore("flashcards");
    flashcardObjStore.add(flashcardData);

    if (el.style.display === "block") {
        el.style.display = "none";
        other.style.display = "flex";
    }else{
        el.style.display = "none";
        other.style.display = "flex";
    }

    document.querySelector("#info h2").innerHTML = flashcardData.name;
    document.querySelector("#info em").innerHTML = flashcardData.desc;
    document.querySelector("#edit-info").innerHTML = '<button id="edit" title="Edit"><i class="fa-solid fa-edit"></i></button>';
    document.querySelector("#edit").onclick = () => {
        document.querySelector("#flashcard-data").style.display = "none";
        document.querySelector("#flashcard-name").style.display = "block";
        document.querySelector("#info").innerHTML = `
        <div>
            <h2></h2>
            <span id="edit-info"></span>
        </div>
        <p id="tagline"><em></em></p>
        `
    };
};

const VALIDATE_FLASHCARD_NAME = (val) => {
    if (val.length >= 4) {
        document.querySelector("#flashcard-name-btn").disabled = false;
    } else {
        document.querySelector("#flashcard-name-btn").disabled = true;
    }
    flashcardData.name = val;
}

const SET_DESC = (val) => {
    flashcardData.desc = val;
}

const CREATE_MODAL = (text) => {
    document.querySelector("#modalbg").style.display = "block"
    document.querySelector("#modalbg").animate({
        opacity: ["0", "1"],
    }, {
        iterations: 1,
        duration: 500,
    });
    document.querySelector("#modal").innerHTML = text;

    window.onclick = (ev) => {
        if (ev.target === document.querySelector("#modalbg")) {
            document.querySelector("#modalbg").animate({
                opacity: ["1", "0"],
            }, {
                iterations: 1,
                duration: 500,
            });
            setTimeout(() => {
                document.querySelector("#modalbg").style.display = "none"
            }, 490);
        };
    };
};

function ROTATE_CARD(card) {
    card.animate({
        transform: ["rotateY(-180deg)", "rotateY(0deg)"]
    }, {
        duration: 250,
        iterations: 1
    });
    if (card.querySelector(".card-text").innerHTML === flashcardData.flashcards[index].term) {
        card.querySelector(".card-text").innerHTML = flashcardData.flashcards[index].def;
    } else {
        card.querySelector(".card-text").innerHTML = flashcardData.flashcards[index].term;
    };
};

const PREVIEW_CARD = (index) => {
    document.querySelector("#preview").innerHTML = `
        <div class='card-wrap' onclick=ROTATE_CARD(this) oncontextmenu=SHOW_MENU(event)>
            <div class="card">
                <p class="card-text">${index}</p>
            </div>
        </div>
    `

    SHOW_MENU = (e) => {
        e.preventDefault();
        document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX}px`;
        window.onclick = (e) => {
            if (e.target !== document.querySelector("#contextmenu")) {
                document.querySelector("#contextmenu").style.display = "none";
            };
        };
    };
};

const ADD_CARD = () => {
    // index = 0;
    document.querySelector("#preview").innerHTML = "";
    if (!isEdit) {
        index = flashcardData.flashcards.length - 1;
    }
    PREVIEW_CARD(flashcardData.flashcards[index].term);
    FLASHCARD_COUNT();
    SET_PROGRESS();
};

//code for flashcard starts here //

class Flashcard{
    constructor(term, def){
        this.term = term;
        this.def = def;
    };
    add(){
        flashcardData.flashcards.push({
            term: this.term,
            def: this.def
        });
        var trx = request.result.transaction("flashcards", "readwrite");
        var flashcardObjStore = trx.objectStore("flashcards");
        var data = flashcardObjStore.get(flashcardData.id);

        data.onsuccess = function(){
            flashcardData.number = flashcardData.flashcards.length;
            flashcardObjStore.put(flashcardData);
        }
    }
    delete(ind){
        flashcardData.flashcards.splice(ind, 1);
        flashcardData.number = flashcardData.flashcards.length;
    }
    edit(i){
        CREATE_MODAL(`
            <h3>Edit flashcard</h3>
            <form autocomplete="off" spellcheck="false">
                ${document.querySelector("#flashcard-data form").innerHTML}
            </form>
        `);
        document.querySelector("#modal form button").textContent = "Save Changes";
        document.querySelector("#modal form #term").value = flashcardData.flashcards[i].term;
        document.querySelector("#modal form #def").value = flashcardData.flashcards[i].def;
        document.querySelector("#modal form").onsubmit = (e) => {
            e.preventDefault();
            flashcardData.flashcards[i] = new Flashcard(document.querySelector("#modal form #term").value, document.querySelector("#modal form #def").value);
            ADD_CARD();
            isEdit = !isEdit;
            var trx = request.result.transaction("flashcards", "readwrite");
            var objectStore = trx.objectStore("flashcards");
            var data = objectStore.get(flashcardData.id);
        
            data.onsuccess = function(){
                objectStore.put(flashcardData);
            }
            document.querySelector("#modalbg").animate({
                opacity: ["1", "0"],
            }, {
                iterations: 1,
                duration: 500
            })
            setTimeout(() => {
                document.querySelector("#modalbg").style.display = "none"
            }, 490);
        }
    }
}

function MOBILE_PREVIEW(el) {
    if (el.classList.contains("set-up")) {
        document.querySelector("#flashcard-preview").style.display = "block";
        document.querySelector("#flashcard-data form").style.display = "none";
        el.textContent = "Go back to setup page";
        el.removeAttribute("class");
    } else {
        document.querySelector("#flashcard-preview").style.display = "none";
        document.querySelector("#flashcard-data form").style.display = "block";
        el.textContent = "Preview Flashcards";
        el.setAttribute("class", "set-up");
    }
}

document.querySelector("#flashcard-data form").onsubmit = (ev) => {
    ev.preventDefault();
    card = new Flashcard(document.querySelector("#flashcard-data form #term").value, document.querySelector("#flashcard-data form #def").value);
    card.add();
    ADD_CARD();
    // FLASHCARD_COUNT();
    document.querySelector("#flashcard-data form").reset();
}

function DELETE_FLASHCARD(){
    card = new Flashcard(flashcardData.flashcards[index].term, flashcardData.flashcards[index].def);
    card.delete(index);
    console.log(flashcardData);
    var trx = request.result.transaction("flashcards", "readwrite");
    var flashcardObjStore = trx.objectStore("flashcards");
    flashcardObjStore.put(flashcardData);
    if (flashcardData.flashcards.length) {
        PREVIEW_CARD(flashcardData.flashcards[0].term);
        index = 0;
        FLASHCARD_COUNT();
        SET_PROGRESS();
    }else{
        document.querySelector("#flashcard-count").innerHTML = "";
        document.querySelector("#level").style.width = "0%";
    }
}

function EDIT_CARD(){
    isEdit = !isEdit;
    if (!flashcardData.flashcards.length) {
        CREATE_MODAL('OOPS... You have not added any flashcards yet.');
        return;
    }
    card = new Flashcard(flashcardData.flashcards[index].term, flashcardData.flashcards[index].def);
    card.edit(index);
}

const GO_TO_PREV_CARD = () => {
    try{
        if (index <= 0) {
            index = 0;
            if (flashcardData.flashcards.length) {
                CREATE_MODAL("<p class='error-head'>You have reached the first flashcard</p>");                
            }else{
                CREATE_MODAL('OOPS... You have not added any flashcards yet.');
            }
        }else{
            index--;
            PREVIEW_CARD(flashcardData.flashcards[index].term);
            FLASHCARD_COUNT();
            SET_PROGRESS();
        }
    }catch(error){
        console.log(error);
    }
}

const GO_TO_NEXT_CARD = () => {
    try{
        if (index >= flashcardData.flashcards.length - 1) {
            index = flashcardData.flashcards.length - 1;
            if (flashcardData.flashcards.length) {
                CREATE_MODAL(`
                    <p class='error-head'>You have reached the last Flashcard.</p>
                    <div class='end-of'>
                        <button>Home</button>
                        <button>Create New Set</button>
                    </div>
                `);
            }else{
                CREATE_MODAL('OOPS... You have not added any flashcards yet.');
            }
        }else{
            index++;
            PREVIEW_CARD(flashcardData.flashcards[index].term);
            SET_PROGRESS();
            FLASHCARD_COUNT();
        }
    }catch(error){
        console.log(error);
    }
}

const FLASHCARD_COUNT = () => {
    document.querySelector("#flashcard-count").innerHTML = `${index+1} of ${flashcardData.flashcards.length}`;
    document.querySelector(".number").innerHTML = flashcardData.flashcards.length ? `${flashcardData.flashcards.length} ${flashcardData.flashcards.length > 1 ? "flashcards" : "flashcard"} added` : "No flashcards added yet.";
}

const SET_PROGRESS = () => {
    document.querySelector("#level").style.width = `${((index + 1) / flashcardData.flashcards.length) * 100}%`
}

//todo: user must close any active sessions to create new FC
if (sessionStorage.getItem("ace-it temp data")) {
    request.onsuccess = function(){
        var trx = request.result.transaction("flashcards", "readwrite");
        var flashcardObjStore = trx.objectStore("flashcards");
        var x = flashcardObjStore.get(flashcardData.id);
        x.onsuccess = function (ev) {
            sessionStorage.setItem("ace-it temp data", JSON.stringify(ev.target.result));
            flashcardData = ev.target.result;
            document.querySelector("title").innerHTML = `Ace It | ${flashcardData.name}`;
            if (flashcardData.flashcards.length) {
                PREVIEW_CARD(flashcardData.flashcards[0].term);
                // ADD_CARD();
                SET_PROGRESS();
                FLASHCARD_COUNT();
            }
        }
    }

    document.querySelector("#flashcard-data").style.display = "flex";
    document.querySelector("#flashcard-name").style.display = "none";
    
    var session = JSON.parse(sessionStorage.getItem("ace-it temp data"));
    document.querySelector("h1").innerHTML = "";
    document.querySelector("#info h2").innerHTML = session.name;
    document.querySelector("#info em").innerHTML = session.desc;

    flashcardData = session;
    flashcardData.flashcards = session.flashcards;
    if (flashcardData.flashcards.length) {
        PREVIEW_CARD(flashcardData.flashcards[0].term);
        SET_PROGRESS();
        FLASHCARD_COUNT();
    }
}