import {Component} from "../component.js"
import {Icon} from "../icon.js"
import {Counter} from "../counter.js"
import {prompt as P} from "../prompts.js"
import * as api from "../../api.js"
import {E} from '../../elements.js'
import {getPrice} from "../../localization.js"
import {dynamicTextSize} from "../../dynamicText.js"

export class CartItem extends Component {
    constructor(configuration) {
        super();

        this.configuration = configuration
    }

    connectedCallback() {
        super.connectedCallback();

        const product = this.configuration.product

        // Configure product icon
        this.productIcon = this.appendChild(new Icon(product.icon, product.displayName, this.configuration.modificationsCount === 0 ? 'No mods' : 'mod'.times(this.configuration.modificationsCount)))
        this.productIcon.onclick = () => {
            // Select item as current
            this.configuration.select()
            E['cart-page'].hidden = true
        }
        setTimeout(() => {
            dynamicTextSize(this.productIcon.partNameElement, 10, 30, 0.9)
        }, 0)

        // Configure item count component
        this.itemCount = this.appendChild(new Counter())

        // Configure price text
        this.priceText = this.appendNew('span', {class: 'money'})
        this.itemCount.countChanged.subscribe(newCount => {
            if (newCount < 1) this.itemCount.count = 1
            else {
                this.configuration.count = newCount
                this.priceText.innerText = `${getPrice(newCount * this.configuration.price)}`
                E['cart-page'].price.innerText = `${getPrice(api.cart.price)}`
            }
        })
        this.itemCount.count = this.configuration.count

        // Configure delete button
        this.deleteButton = this.appendNew('img', {src: 'images/crossWhite.svg', alt: ''})
        this.deleteButton.addEventListener('click', () => {
            P('Delete this item from the cart?', () => {
                api.cart.remove(this.configuration)
                E['cart-icon'].update()
                E['cart-page'].update()
            })
        })
    }
}

customElements.define('app-cart-item', CartItem)
