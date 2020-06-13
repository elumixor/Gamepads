import * as util from './util.js'
import * as api from './api.js'


(async function initialize() {
    await api.initialize()

    console.log(api.newConfiguration('xbox'))
})()

function onButtonClicked() {
    console.log("Button Clicked")
    console.log([1,2,3].sum())
}

document.getElementById("test-button").addEventListener("click", onButtonClicked)
