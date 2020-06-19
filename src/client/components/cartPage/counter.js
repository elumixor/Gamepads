import {Component} from "../component.js"

export class Counter extends Component {
    constructor(initialCount = 0) {
        super();
        this.currentCount = initialCount
        this.onCountChanged = () => {}
    }

    connectedCallback() {
        super.connectedCallback();

        this.decElement = this.appendNew('button')
        this.decElement.innerText = '-'
        this.countElement = this.appendNew('span')
        this.incElement = this.appendNew('button')
        this.incElement.innerText = '+'

        this.decElement.addEventListener('click', () => --this.count)
        this.incElement.addEventListener('click', () => ++this.count)
    }

    get count() {
        return this.currentCount
    }

    set count(newCount) {
        this.currentCount = newCount
        this.countElement.innerText = `${newCount}`
        this.onCountChanged(newCount)
    }
}

customElements.define('app-counter', Counter)
