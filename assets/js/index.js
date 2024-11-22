const dynamicText = document.querySelector("#dynamic");
const words = ["Simple", "Sleek", "Effective"];
let charIndex = 0;
let wordIndex = 0;
let isDeleting = false;

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
        };
    };
};

const TOGGLE_MATERIALS_LIST = (el, parent) => {
    parent.nextElementSibling.classList.toggle("expand");
    if (parent.nextElementSibling.classList.contains("expand")) {
        el.setAttribute("class", "fa-solid fa-caret-up");
    }else{
        el.setAttribute("class", "fa-solid fa-caret-down");
    }
};

const TYPE_EFFECT = () => {
    let currentWord = words[wordIndex];
    let currentChar = currentWord.substring(0, charIndex);
    dynamicText.textContent = currentChar;

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(TYPE_EFFECT, 300);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(TYPE_EFFECT, 200);
    } else {
        isDeleting = !isDeleting;
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(TYPE_EFFECT, 1750);
    };
};

TYPE_EFFECT();

//get saved flashcards
function GET_CARDS(){
    request.onsuccess = function(){
        var trx = request.result.transaction("flashcards");
        var objectStore = trx.objectStore("flashcards");
        var keys = objectStore.getAll();
        let savedData;
        
        keys.onsuccess = async function(ev){
            savedData = await ev.target.result;
            document.querySelector("#recent ul").innerHTML = "Loading...";
            document.querySelector("#recent ul").innerHTML = "";

            if (!ev.target.result.length) {
                document.querySelector("#recent ul").innerHTML = "<p id='no-flashcard'>You have not created any flashcard set yet.</p>";
            }

            await ev.target.result.forEach(flashcard => {
                let info = `"Flashcards: ${flashcard.number}\nCreated on: ${flashcard.created}\nId: ${flashcard.id}"`
                document.querySelector("#recent ul").innerHTML += `
                    <li title=${info}>
                        <button>${flashcard.name}</button>
                    </li>
                `;
            });

            [...document.querySelectorAll("#recent button")].forEach((val, i) => {
                val.onclick = function(event){
                    event.preventDefault();
                    CREATE_MODAL(`
                        <div id='recent-info'>
                            <h3>${savedData[i].name} </h3>
                            <strong><em>${savedData[i].desc}</em></strong>
                            <table>
                                <tr>
                                    <th>Flashcards</th>
                                    <td>${savedData[i].number}</td>
                                </tr>
                                <tr>
                                    <th>Id</th>
                                    <td>${savedData[i].id}</td>
                                </tr>
                                <tr>
                                    <th>Created On</th>
                                    <td>${savedData[i].created}</td>
                                </tr>
                            </table>
                            <div id='recent-actions'>
                                <button id="open-recent">open</button>
                                <button id="del-recent">delete</button>
                                </div>
                        </div>
                    `);

                    document.querySelector("#open-recent").onclick = function(){
                        console.log(savedData[i]);
                        sessionStorage.setItem("ace-it temp data", JSON.stringify(savedData[i]));
                        window.open("./assets/flashcard/index.html","_blank");
                    }
                    
                    document.querySelector("#del-recent").onclick = function(){
                        var confirmUserAction = confirm(`WARNING! You are about to delete the Set - ${savedData[i].name} and all its related data. This action cannot be reversed. Do you wish to continue?`);
                        if (confirmUserAction) {
                            var trx = request.result.transaction("flashcards", "readwrite");
                            var objectStore = trx.objectStore("flashcards");
                            objectStore.delete(savedData[i].id);
                            history.go(0);
                        }else{
                            alert("Delete operation cancelled by user.")
                        }
                    }
                }
            });
        }
    }
};

function CREATE_NEW(){
    // if (sessionStorage.getItem("ace-it temp data")) {
    //     var isActiveSession = confirm("There is currently an active flashcard session, do you want to close the session and create a new flashcard?");
    //     if (isActiveSession) {
    //         sessionStorage.removeItem("ace-it temp data")
    //     }else{
    //         alert("Session still active, cannot create new flashcard while another flashcard session is open.");
    //         return;
    //     }
    // }
    window.open(`./assets/flashcard/index.html`);
}

GET_CARDS();

async function INIT_SHARE(){
    if ("share" in navigator) {
        try {
            await navigator.share({
                text: "Welcome to Ace It! Your tool for creating flashcards on the web!",
                title: "Ace It!",
                url: "http://127.0.0.1:5500/",
                
            });
        } catch (error) {
            CREATE_MODAL("AN error occured while trying to share.");
        }
    } else {
        CREATE_MODAL(`
            <p class=error-head>Share action not supported by device or browser.</p>
            <ul type='none' class='error'>
                <li>Try:</li>
                <li>Reloading this page</li>
                <li>Updating your browser</li>
                <li>Opening this page on a different browser</li>
                <li>Opening this page on a different device</li>
            </ul>
        `);
    }
}

function DISPLAY_TERMS(){
    CREATE_MODAL(`
        <h3>PRIVACY POLICY</h3>
        <ul class='privacy-policy error' type='none'>
            <li>By using our tool, you agree to the following terms and conditions:</li>
            <li>That some of your personal information would and information regarding your device, browser, operating system and location would be collected.</li>
            <li>That the collected information would be used for the following purposes:
                <ul type='none'>
                    <li>To provide and improve our services.</li>  
                    <li>To analyze how our tool is used.</li>  
                    <li>To protect our website and users.</li>  
                </ul>
            </li>
            <li>That we may share your personal information with third parties like service, hosting and analytic providers if required.</li>            
        </ul>

        <div class='error'>
            <h4>Your Rights</h4>
            <p>You reserve the right to:</p>
            <ul type='none'>
                <li>Access your personal information.</li>  
                <li>Correct your personal information.</li>
                <li>Delete your personal information.</li>  
            </ul>
        </div>

        <div class='error'>
            <h4>Update to Privacy Policy</h4>
            <p>&nbsp;We may update this Privacy Policy at intervals, we would notify you of any changes by posting it on our homepage.</p>
        </div>

        <div class='error'>
            <h4>Your Rights</h4>
            <p>&nbsp;For further enquires, contact us at <a href="mailto:dev.mode006@gmail.com">dev.mode006@gmail.com</a></p>
        </div>
    `);
}