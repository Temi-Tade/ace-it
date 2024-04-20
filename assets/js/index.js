const dynamicText = document.querySelector("#dynamic")
const words = ["Simple", "Sleek", "Effective"]
let charIndex = 0
let wordIndex = 0
let isDeleting = false

const TOGGLE_MATERIALS_LIST = (el) => {
    el.nextElementSibling.classList.toggle("expand")
}

const TYPE_EFFECT = () => {
    let currentWord = words[wordIndex]
    let currentChar = currentWord.substring(0, charIndex)
    dynamicText.textContent = currentChar

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++
        setTimeout(TYPE_EFFECT, 300)
    } else if (isDeleting && charIndex > 0) {
        charIndex--
        setTimeout(TYPE_EFFECT, 200)
    } else {
        isDeleting = !isDeleting
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex
        setTimeout(TYPE_EFFECT, 1750)
    }
}

TYPE_EFFECT()