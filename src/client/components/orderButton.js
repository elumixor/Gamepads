import {Responsive} from "./responsive.js"
import {Component} from "./component.js"
import * as api from "../api.js"
import {getPrice} from "../localization.js"
import {prompt as P} from "./prompts.js"

export class OrderButton extends Responsive(Component) {
    constructor() {
        super();

        this.sendIn = this.hasAttribute('data-send-in')

        if (this.sendIn) {
            api.updateEvent.subscribe((config) => this.price = config.sendInPrice)
            this.onclick = () => {
                P(`<h3>You have chosen to send in your controller for modification</h3><p>Please send your controller to <b>Prague, Czech Republic</b></p>`, () => {
                    const C = api.currentConfiguration()
                    C.sendIn = true
                    api.saveToCart(C)
                }, () => {}, "Okay", "Cancel")
            }
            api.changeEvent.subscribe(c => {
                if (api.cart.contains(c)) {
                    this.priceEl.innerText = ''
                    this.text.innerText = 'Save (send in)'
                    this.priceEl.style.display = 'inherit'
                }
            })
        } else {
            api.updateEvent.subscribe(({price}) => this.price = price)
            this.onclick = () => {
                const C = api.currentConfiguration()
                C.sendIn = false
                api.saveToCart(C)
            }

            api.changeEvent.subscribe(c => {
                if (api.cart.contains(c)) {
                    this.priceEl.innerText = ''
                    this.text.innerText = 'Save'
                    this.priceEl.style.display = 'inherit'
                }
            })
        }
    }

    connectedCallback() {
        this.text = this.appendNew('span')
        this.text.innerText = this.sendIn ? 'Order for ' : 'Send in for '
        this.priceEl = this.appendNew('span', {class: 'money'})
    }

    set price(newPrice) {
        if (api.cart.contains(api.currentConfiguration())) {
            this.priceEl.innerText = ''
            this.text.innerText = !this.sendIn ? 'Save ' : 'Save (send in) '
            this.priceEl.style.display = 'inherit'
        } else {
            this.text.innerText = !this.sendIn ? 'Order for ' : 'Send in for '
            this.priceEl.style.display = 'inline-block'
            this.priceEl.innerText = `${getPrice(newPrice)}`
        }
    }
}


