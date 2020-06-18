import * as util from '../util.js'

export class PartIcon extends HTMLElement {
    constructor() {
        super();

        this.imageElement = document.createElement('img')
        this.imageElement.alt = ''
        this.dimmerElement = document.createElement('div')
        this.dimmerElement.classList.add('dimmer')

        this.patNameElement = document.createElement('div')
        this.patNameElement.classList.add('part-name')

        this.optionsCountElement = document.createElement('div')
        this.optionsCountElement.classList.add('options-count')
    }

    set part(newPart) {
        this.imageElement.src = newPart.icon
        this.patNameElement.innerText = newPart.displayName

        const optionsCount = newPart.options.length
        this.optionsCountElement.innerText = 'option'.times(optionsCount)
    }

    connectedCallback() {
        this.appendChild(this.imageElement)
        this.appendChild(this.dimmerElement)
        this.appendChild(this.patNameElement)
        this.appendChild(this.optionsCountElement)
    }
}

window.customElements.define('app-part-icon', PartIcon)
