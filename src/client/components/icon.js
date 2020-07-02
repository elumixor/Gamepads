import * as util from '../util.js'

export class Icon extends HTMLElement {
    constructor(imagePath, displayName, additionalInfo) {
        super();

        this.imageElement = document.createElement('img')
        this.imageElement.alt = ''
        this.dimmerElement = document.createElement('div')
        this.dimmerElement.classList.add('dimmer')

        this.partNameElement = document.createElement('div')
        this.partNameElement.classList.add('part-name')

        this.optionsCountElement = document.createElement('div')
        this.optionsCountElement.classList.add('options-count')

        this.imageElement.src = imagePath
        this.partNameElement.innerText = displayName
        this.optionsCountElement.innerText = additionalInfo
    }

    connectedCallback() {
        this.appendChild(this.imageElement)
        this.appendChild(this.dimmerElement)
        this.appendChild(this.partNameElement)
        this.appendChild(this.optionsCountElement)
    }
}
