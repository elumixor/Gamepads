import {currentConfiguration as C} from "../api.js"
import {Component} from "./component.js"

export class OptionIcon extends Component {
    constructor(partName, option, scrollContainer) {
        super();

        this.onclick = () => C().selectOption(partName, option)
        this.option = option
        this.scrollContainer = scrollContainer
    }

    connectedCallback() {
        this.image = this.appendNew('div', {class: 'image'})
        this.image.style.backgroundImage = 'url(' + this.option.icon + ')'
        this.tooltip = this.image.appendNew('div', {class: 'tooltip'})
        this.tooltip.innerText = this.option.tooltip || this.option.name

        this.image.onmouseenter = () => {
            const w = this.tooltip.offsetWidth
            const h = this.tooltip.offsetHeight

            const x = this.offsetLeft - w / 2 + this.offsetWidth / 2 - this.scrollContainer.scrollLeft
            const y = this.offsetTop - h - 10


            this.tooltip.style.left = x + 'px'
            this.tooltip.style.top = y + 'px'
        }
    }
}

window.customElements.define('app-option-icon', OptionIcon)
