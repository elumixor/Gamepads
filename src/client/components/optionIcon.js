import {currentConfiguration as C} from "../api.js"

export class OptionIcon extends HTMLElement {
    constructor(partName, option) {
        super();

        this.onclick = () => C().selectOption(partName, option)
    }
}

window.customElements.define('app-option-icon', OptionIcon)
