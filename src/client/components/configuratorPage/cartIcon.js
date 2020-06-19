import {Component} from "../component.js"
import * as api from "../../api.js"

export class CartIcon extends Component {
    constructor() {
        super();

        this.onClick = () => {
        }
        this.addEventListener('click', () => this.onClick())
    }

    connectedCallback() {
        this.appendNew('img', {src: 'images/cart.svg', alt: ''})
        this.itemsCount = this.appendNew('div')
    }

    update() {
        if (api.cart.length > 0) {
            this.itemsCount.innerText = api.cart.length
            this.itemsCount.hidden = false
        } else
            this.itemsCount.hidden = true
    }
}

customElements.define('app-cart-icon', CartIcon)
