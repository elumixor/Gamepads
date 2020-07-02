import {PageComponent} from "../pageComponent.js"
import * as api from '../../api.js'
import {E} from '../../elements.js'
import {ConfirmCancel} from "../confirmCancel.js"
import {CartItem} from "./cartItem.js"
import {prompt as P} from "../prompts.js"
import {Responsive} from "../responsive.js"

export class CartPage extends Responsive(PageComponent) {
    constructor() {
        super();
    }

    connectedCallback() {
        // Heading (Cart: 3 items)
        const heading = this.appendNew('div', {class: 'heading'})
        const c = heading.appendNew('span')
        c.innerText = 'Cart:'
        this.headingItems = heading.appendNew('span')

        // Container for options
        this.itemsContainer = this.appendNew('div', {class: 'items'})

        // Total (Total: 3 items)
        const total = this.appendNew('div', {class: 'total'})
        const t = total.appendNew('span')
        t.innerText = 'Total: '
        this.price = total.appendNew('span')

        // Input for email
        this.email = this.appendNew('input', {type: 'email'})
        this.email.addEventListener('input', () => this.validateCart())
        this.email.placeholder = 'Email for payment details'
        this.email.onkeydown = e => {
            //See notes about 'which' and 'key'
            if (e.key === 'Enter') {
                this.confirmCancel.confirm()
                return false;
            }
        }

        // "Back" and "Send Order" buttons
        this.confirmCancel = this.appendChild(new ConfirmCancel("Send Order", "Back"))
        this.confirmCancel.actions.cancel = () => this.hidden = true
        this.confirmCancel.actions.confirm = () => {
            this.hidden = true
            P(`Payment detail will be sent to <b class="money">${this.email.value}</b>
                            <br/><br/>Order will be processed upon receiving payment.
                            <br/><br/>Continue?`, () => {
                api.sendOrder()
                this.update()
                E['cart-icon'].update()
            }, () => this.hidden = false)
        }

        // Validate email
        this.validateCart()

        // Hide cart by default
        this.hidden = true
    }

    update() {
        this.headingItems.innerText = 'item'.times(api.cart.length)
        this.price.innerText = `\$${api.cart.price}`

        this.itemsContainer.removeChildren()

        // Add configurations as CartItems
        api.cart.forEach(configuration => this.itemsContainer.appendChild(new CartItem(configuration)))
        this.validateCart()
    }

    open() {
        this.update()
        this.hidden = false
    }

    validateCart() {
        const emailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(this.email.value)

        this.confirmCancel.disabled = !emailValid || api.cart.empty
    }
}

