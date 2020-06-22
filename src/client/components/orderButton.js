import {Responsive} from "./responsive.js"
import {Component} from "./component.js"
import * as api from "../api.js"

export class OrderButton extends Responsive(Component) {
    constructor() {
        super();

        api.updateEvent.subscribe(({price}) => this.price = price)
        this.onclick = () => api.saveToCart(api.currentConfiguration())
    }

    connectedCallback() {
        this.text = this.appendNew('span')
        this.text.innerText = 'Order for '
        this.priceEl = this.appendNew('span', {class: 'money'})
    }

    set price(newPrice) {
        this.priceEl.innerText = `\$${newPrice}`
    }
}


