import {Responsive} from "./responsive.js"
import {Component} from "./component.js"
import * as api from "../api.js"

export class OrderButton extends Responsive(Component) {
    constructor() {
        super();

        api.updateEvent.subscribe(({price}) => this.price = price)
        this.onclick = () => api.saveToCart(api.currentConfiguration())

        api.changeEvent.subscribe(c => {
            if (api.cart.contains(c)) {
                this.priceEl.innerText = ''
                this.text.innerText = 'Save and create new'
                this.priceEl.style.display = 'inherit'
            }
        })
    }

    connectedCallback() {
        this.text = this.appendNew('span')
        this.text.innerText = 'Order for '
        this.priceEl = this.appendNew('span', {class: 'money'})
    }

    set price(newPrice) {
        if (api.cart.contains(api.currentConfiguration())) {
            this.priceEl.innerText = ''
            this.text.innerText = 'Save and create new'
            this.priceEl.style.display = 'inherit'
        } else {
            this.text.innerText = 'Order for '
            this.priceEl.style.display = 'inline-block'
            this.priceEl.innerText = `\$${newPrice}`
        }
    }
}


