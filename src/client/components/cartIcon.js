import {Component} from "./component.js"

export class CartIcon extends Component {
    constructor() {
        super();
    }

    connectedCallback() {
        this.image = this.appendNew('img', {src: 'images/cart.svg', alt: ''})
        this.itemsCount = this.appendNew('div')
    }

    set cart(newCart) {
        if (newCart.length > 0) {
            this.itemsCount.innerText = newCart.length
            this.itemsCount.hidden = false
        } else
            this.itemsCount.hidden = true
    }
}

customElements.define('app-cart-icon', CartIcon)
