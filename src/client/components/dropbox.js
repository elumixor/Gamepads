import {Component} from './component.js'

export class Dropbox extends Component {
    constructor(items) {
        super()

        this.items = items
    }

    connectedCallback() {
        this.items.iterate((name, callback) => {
            const link = this.appendNew('div')
            link.innerText = name
            link.onclick = callback
        })
    }

}

window.customElements.define('app-dropbox', Dropbox)
