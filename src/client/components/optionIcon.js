import {currentConfiguration as C} from "../api.js"
import {Component} from "./component.js"

export class OptionIcon extends Component {
    constructor(partName, option) {
        super();

        this.onclick = () => C().selectOption(partName, option)
        this.option = option
    }

    connectedCallback() {
        this.image = this.appendNew('img', {src: this.option.icon || '', alt: ''})
    }
}

window.customElements.define('app-option-icon', OptionIcon)
