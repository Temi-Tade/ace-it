let index = 0;
let card;
var flashcardData = JSON.parse(sessionStorage.getItem("ace-it temp data"));

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

    document.querySelector("#info h2").innerHTML = flashcardData.name
    document.querySelector("#info em").innerHTML = flashcardData.desc
    document.querySelector("#edit-info").innerHTML = '<button id="edit" title="Edit"><i class="fa-solid fa-edit"></i></button>'
    document.querySelector("#edit").onclick = () => {
        document.querySelector("#flashcard-data").style.display = "none"
        document.querySelector("#flashcard-name").style.display = "block"
        document.querySelector("#info").innerHTML = `
        <div>
            <h2></h2>
            <span id="edit-info"></span>
        </div>
        <p id="tagline"><em></em></p>
        `
    }
}

const VALIDATE_FLASHCARD_NAME = (val) => {
    if (val.length >= 4) {
        document.querySelector("#flashcard-name-btn").disabled = false
    } else {
        document.querySelector("#flashcard-name-btn").disabled = true
    }
    flashcardData.name = val
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
    })
    document.querySelector("#modal").innerHTML = text

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
        }
    }
}

function ROTATE_CARD(card) {
    // console.log(flashcardData.flashcards[index].term);
    console.log(index);
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
    }
}

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
        document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX - 200}px`;
        window.onclick = (e) => {
            if (e.target !== document.querySelector("#contextmenu")) {
                document.querySelector("#contextmenu").style.display = "none";
            }
        }
    }
}

const ADD_CARD = () => {
    index = 0;
    document.querySelector("#preview").innerHTML = "";
    PREVIEW_CARD(flashcardData.flashcards[0].term);
    FLASHCARD_COUNT();
    SET_PROGRESS();
    // [...document.querySelectorAll(".card")].forEach((val) => {
    //     val.onclick = () => {
    //         val.animate({
    //             transform: ["rotateY(-180deg)", "rotateY(0deg)"]
    //         }, {
    //             duration: 250,
    //             iterations: 1
    //         })  
    //         if (val.querySelector(".card-text").innerHTML === flashcardData.flashcards[0].term) {
    //             val.querySelector(".card-text").innerHTML = flashcardData.flashcards[0].def;
    //         } else {
    //             val.querySelector(".card-text").innerHTML = flashcardData.flashcards[0].term;
    //         }
    //     }

    //     val.oncontextmenu = (e) => {
    //         e.preventDefault();
    //         document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX - 200}px`;
    //         window.onclick = (e) => {
    //             if (e.target !== document.querySelector("#contextmenu")) {
    //                 document.querySelector("#contextmenu").style.display = "none";
    //             }
    //         }
    //     }
    // })
}

//code for flashcard starts here //
// var cards = flashcardData.flashcards;

class Flashcard{
    constructor(term, def){
        this.term = term;
        this.def = def;
    }
    add(){
        flashcardData.flashcards.push({
            term: this.term,
            def: this.def
        })
        var trx = request.result.transaction("flashcards", "readwrite");
        var flashcardObjStore = trx.objectStore("flashcards");
        var data = flashcardObjStore.get(flashcardData.id);
        console.log(data);

        data.onsuccess = function(){
            // flashcardData.flashcards = cards;
            flashcardData.number = flashcardData.flashcards.length;
            flashcardObjStore.put(flashcardData);
            console.log(flashcardObjStore.get(flashcardData.id));
        }
    }
    delete(ind){
        flashcardData.flashcards.splice(ind, 1);
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

document.querySelector("#flashcard-data form").onsubmit = (ev) => {
    ev.preventDefault();
    if (window.innerWidth <= 420) {
        document.querySelector("#set-up_prev").onclick = function (){
            if (this.classList.contains("set-up")) {
                TOGGLE_FORMS(ev, document.querySelector("#flashcard-data form"), document.querySelector("#flashcard-preview"));
                this.textContent = "Go back to setup page";
                this.removeAttribute("class");
            } else {
                TOGGLE_FORMS(ev, document.querySelector("#flashcard-preview"), document.querySelector("#flashcard-data form"));
                this.textContent = "Preview Flashcards";
                this.setAttribute("class", "set-up");
            }
        }
    }
     card = new Flashcard(document.querySelector("#flashcard-data form #term").value, document.querySelector("#flashcard-data form #def").value);
    card.add();
    ADD_CARD();
    document.querySelector("#flashcard-data form").reset();

    // document.querySelector("#edit-flashcard-btn").onclick = () => {
    //     card.edit(index);
    // }

    document.querySelector("#contextmenu button").onclick = () => {
        card.delete(index);
        PREVIEW_CARD(flashcardData.flashcards[0].term);
        FLASHCARD_COUNT();
        SET_PROGRESS();
    }
}

function EDIT_CARD(){
    card = new Flashcard(flashcardData.flashcards[index].term, flashcardData.flashcards[index].def);
    card.edit(index);
}

const GO_TO_PREV_CARD = () => {
    try{
        index--;
        // console.log(flashcardData.flashcards[index].term);
        console.log(index);
        if (index < 0) {
            index = 0;
        }
        PREVIEW_CARD(flashcardData.flashcards[index].term);
        FLASHCARD_COUNT();
        SET_PROGRESS();
    }catch{
        CREATE_MODAL('OOPS... You have not added any flashcards yet.');
    }
}

const GO_TO_NEXT_CARD = () => {
    try{
        index++;
        // console.log(flashcardData.flashcards[index].def);
        console.log(index);
        if (index > flashcardData.flashcards.length - 1) {
            index = flashcardData.flashcards.length - 1;
        }
        PREVIEW_CARD(flashcardData.flashcards[index].term);
        SET_PROGRESS();
        FLASHCARD_COUNT();
    }catch{
        CREATE_MODAL('OOPS... You have not added any flashcards yet.');
    }
}

const FLASHCARD_COUNT = () => {
    document.querySelector("#flashcard-count").innerHTML = `${index+1} of ${flashcardData.flashcards.length}`;
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
            PREVIEW_CARD(flashcardData.flashcards[0].       term);
            ADD_CARD();
            SET_PROGRESS();
            FLASHCARD_COUNT();
        }
    }

    // console.log(flashcardData);
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
    }
    PREVIEW_CARD(flashcardData.flashcards[0].term);
    ADD_CARD();
    SET_PROGRESS();
    FLASHCARD_COUNT();
}