import '../shared/util.js'


function onButtonClicked() {
    console.log("Button Clicked")
    console.log([1,2,3].sum())
}

document.getElementById("test-button").addEventListener("click", onButtonClicked)
