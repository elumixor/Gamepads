import {Component} from "./component.js"
import * as api from "../api.js"
import {E} from '../elements.js'

export class CartIcon extends Component {
    constructor() {
        super();

        api.changeEvent.subscribe(() => this.update())
        this.onclick = () => E['cart-page'].open()
    }

    connectedCallback() {
        this.appendNew('img', {src: 'images/cart.svg', alt: ''})
        this.itemsCount = this.appendNew('div', {hidden: true})
    }

    update() {
        if (api.cart.length > 0) {
            this.itemsCount.innerText = api.cart.length
            this.itemsCount.hidden = false
        } else
            this.itemsCount.hidden = true
    }
}

