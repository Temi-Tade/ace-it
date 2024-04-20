sessionStorage.setItem("ace-it-data", JSON.stringify({
    name: undefined,
    desc: ""
}))

const TOGGLE_FORMS = (e, el, other) => {
    e.preventDefault()
    el.style.display = "none"
    other.style.display = "flex"
    let sessionData = JSON.parse(sessionStorage.getItem("ace-it-data"))
    document.querySelector("#info h2").innerHTML = sessionData.name
    document.querySelector("#info em").innerHTML = sessionData.desc
    document.querySelector("#info").innerHTML += `<button id="edit" title="Edit"><i class="fa-solid fa-edit"></i></button>`
    document.querySelector("#edit").onclick = () => {
        document.querySelector("#flashcard-data").style.display = "none"
        document.querySelector("#flashcard-name").style.display = "block"
        document.querySelector("#info").innerHTML = `
        <div>
            <h2></h2>
            <span><em></em></span>
        </div>`
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
            document.querySelector("#modalbg").style.display = "none"
        }
    }
}

const ADD_CARD = () => {
    let angle = 0
    document.querySelector("#preview").innerHTML = ""
    cards.forEach((val, ind, arr) => {
        document.querySelector("#preview").innerHTML = `
            <div class='card-wrap'>
                <div class="card">
                    <p class="card-text">${arr[0].term}</p>
                </div>
            </div>
        `
    });
    [...document.querySelectorAll(".card")].forEach((val, ind, arr) => {
        val.onclick = () => {
            angle += 360
            val.style.transform = `rotateY(${angle}deg)`
            if (val.querySelector(".card-text").innerHTML === cards[ind].term) {
                val.querySelector(".card-text").innerHTML = cards[ind].def
            } else {
                val.querySelector(".card-text").innerHTML = cards[ind].term
            }
        }
    })
}

//code for flashcard starts here //
const cards = []

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
        cards.splice(ind, 1)
    }
    edit(){
        CREATE_MODAL("")
    }
}

document.querySelector("#flashcard-data form").onsubmit = (ev, term, def) => {
    ev.preventDefault()
    let card = new Flashcard(document.querySelector("#flashcard-data form #term").value, document.querySelector("#flashcard-data form #def").value)
    cards.push(card)
    ADD_CARD()
    console.log(cards)
    document.querySelector("#flashcard-data form").reset()
    //define preview
    //implement edit, next, prev
}