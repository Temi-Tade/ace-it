let index = 0;

sessionStorage.setItem("ace-it-data", JSON.stringify({
    name: undefined,
    desc: ""
}));

const TOGGLE_FORMS = (e, el, other) => {
    e.preventDefault();
    if (window.innerWidth > 420) {
        el.style.display = "none";
        other.style.display = "flex";
    }else{
        el.style.display = "none";
        other.style.display = "block";
    }

    let sessionData = JSON.parse(sessionStorage.getItem("ace-it-data"))
    document.querySelector("#info h2").innerHTML = sessionData.name
    document.querySelector("#info em").innerHTML = sessionData.desc
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
    let sessionData = JSON.parse(sessionStorage.getItem("ace-it-data"))
    sessionData.name = val
    sessionStorage.setItem("ace-it-data", JSON.stringify(sessionData))
}

const SET_DESC = (val) => {
    let sessionData = JSON.parse(sessionStorage.getItem("ace-it-data"))
    sessionData.desc = val
    sessionStorage.setItem("ace-it-data", JSON.stringify(sessionData))
}

const CREATE_MODAL = (text) => {
    document.querySelector("#modalbg").style.display = "block"
    document.querySelector("#modalbg").animate({
        opacity: ["0", "1"],
    }, {
        iterations: 1,
        duration: 500
    })
    document.querySelector("#modal").innerHTML = text

    window.onclick = (ev) => {
        if (ev.target === document.querySelector("#modalbg")) {
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

const PREVIEW_CARD = (index) => {
    document.querySelector("#preview").innerHTML = `
        <div class='card-wrap'>
            <div class="card">
                <p class="card-text">${index}</p>
            </div>
        </div>
    `
}

const ADD_CARD = () => {
    index = 0;
    document.querySelector("#preview").innerHTML = "";
    PREVIEW_CARD(cards[0].term);
    FLASHCARD_COUNT();
    SET_PROGRESS();
    [...document.querySelectorAll(".card")].forEach((val) => {
        val.onclick = () => {
            val.animate({
                transform: ["rotateY(-180deg)", "rotateY(0deg)"]
            }, {
                duration: 250,
                iterations: 1
            })  
            if (val.querySelector(".card-text").innerHTML === cards[0].term) {
                val.querySelector(".card-text").innerHTML = cards[0].def;
            } else {
                val.querySelector(".card-text").innerHTML = cards[0].term;
            }
        }

        val.oncontextmenu = (e) => {
            e.preventDefault();
            document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX - 200}px`;
            window.onclick = (e) => {
                if (e.target !== document.querySelector("#contextmenu")) {
                    document.querySelector("#contextmenu").style.display = "none";
                }
            }
        }
    })
}

//code for flashcard starts here //
const cards = [];

class Flashcard{
    constructor(term, def){
        this.term = term;
        this.def = def;
    }
    add(){
        cards.push({
            term: this.term,
            def: this.def
        })
    }
    delete(ind){
        cards.splice(ind, 1);
    }
    edit(i){
        CREATE_MODAL(`
            <h3>Edit flashcard</h3>
            <form autocomplete="off" spellcheck="false">
                ${document.querySelector("#flashcard-data form").innerHTML}
            </form>
        `);
        document.querySelector("#modal form button").textContent = "Save Changes";
        document.querySelector("#modal form #term").value = cards[i].term;
        document.querySelector("#modal form #def").value = cards[i].def;
        document.querySelector("#modal form").onsubmit = (e) => {
            e.preventDefault();
            cards[i] = new Flashcard(document.querySelector("#modal form #term").value, document.querySelector("#modal form #def").value);
            ADD_CARD();
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
    let card = new Flashcard(document.querySelector("#flashcard-data form #term").value, document.querySelector("#flashcard-data form #def").value);
    card.add();
    ADD_CARD();
    console.log(cards);
    document.querySelector("#flashcard-data form").reset();

    document.querySelector("#edit-flashcard-btn").onclick = () => {
        card.edit(index);
    }

    document.querySelector("#contextmenu button").onclick = () => {
        card.delete(index);
        PREVIEW_CARD(cards[0].term);
        FLASHCARD_COUNT();
        SET_PROGRESS();
        [...document.querySelectorAll(".card")].forEach((val) => {
            val.onclick = () => {
                val.animate({
                    transform: ["rotateY(-180deg)", "rotateY(0deg)"]
                }, {
                    duration: 250,
                    iterations: 1
                })  
                if (val.querySelector(".card-text").innerHTML === cards[index].term) {
                    val.querySelector(".card-text").innerHTML = cards[index].def;
                } else {
                    val.querySelector(".card-text").innerHTML = cards[index].term;
                }
            }

            val.oncontextmenu = (e) => {
                e.preventDefault();
                document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX - 200}px`;
                window.onclick = (e) => {
                    if (e.target !== document.querySelector("#contextmenu")) {
                        document.querySelector("#contextmenu").style.display = "none";
                    }
                }
            }
        })
        console.log(cards);
    }
    //define preview
    //implement edit, next, prev
}

const GO_TO_PREV_CARD = () => {
    try{
        index--;
        if (index < 0) {
            index = 0;
        }
        PREVIEW_CARD(cards[index].term);
        FLASHCARD_COUNT();
        SET_PROGRESS();
        [...document.querySelectorAll(".card")].forEach((val) => {
            val.onclick = () => {
                val.animate({
                    transform: ["rotateY(-180deg)", "rotateY(0deg)"]
                }, {
                    duration: 250,
                    iterations: 1
                })  
                if (val.querySelector(".card-text").innerHTML === cards[index].term) {
                    val.querySelector(".card-text").innerHTML = cards[index].def;
                } else {
                    val.querySelector(".card-text").innerHTML = cards[index].term;
                }
            }

            val.oncontextmenu = (e) => {
                e.preventDefault();
                document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX - 200}px`;
                window.onclick = (e) => {
                    if (e.target !== document.querySelector("#contextmenu")) {
                        document.querySelector("#contextmenu").style.display = "none";
                    }
                }
            }
        })
    }catch{
        CREATE_MODAL('OOPS... You have not added any flashcards yet.');
    }
}

const GO_TO_NEXT_CARD = () => {
    try{
        index++;
        if (index > cards.length - 1) {
            index = cards.length - 1;
        }
        PREVIEW_CARD(cards[index].term);
        SET_PROGRESS();
        FLASHCARD_COUNT();
        [...document.querySelectorAll(".card")].forEach((val, ind) => {
            val.onclick = () => {
                val.animate({
                    transform: ["rotateY(-180deg)", "rotateY(0deg)"]
                }, {
                    duration: 250,
                    iterations: 1
                })  
                if (val.querySelector(".card-text").innerHTML === cards[index].term) {
                    val.querySelector(".card-text").innerHTML = cards[index].def;
                } else {
                    val.querySelector(".card-text").innerHTML = cards[index].term;
                }
            }

            val.oncontextmenu = (e) => {
                e.preventDefault();
                document.querySelector("#contextmenu").style = `display: block; top: ${e.offsetY}px; left: ${e.offsetX - 200}px`;
                window.onclick = (e) => {
                    if (e.target !== document.querySelector("#contextmenu")) {
                        document.querySelector("#contextmenu").style.display = "none";
                    }
                }
            }
        })
    }catch{
        CREATE_MODAL('OOPS... You have not added any flashcards yet.');
    }
}

const FLASHCARD_COUNT = () => {
    document.querySelector("#flashcard-count").innerHTML = `${index+1} of ${cards.length}`;
}

const SET_PROGRESS = () => {
    document.querySelector("#level").style.width = `${((index + 1) / cards.length) * 100}%`
}