import {PageComponent} from "../pageComponent.js"
import * as api from '../../api.js'
import {ConfirmCancel} from "../confirmCancel.js"
import {CartItem} from "./cartItem.js"
import {prompt as P} from "../prompts.js"

export class CartPage extends PageComponent {
    constructor() {
        super();

        this.onBack = () => {
        }
        this.onOrder = () => {
        }
        this.onConfigurationRemoved = () => {
        }
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
        this.email.addEventListener('input', () => this.onEmailChanged())
        this.email.placeholder = 'Email for payment details'

        // "Back" and "Send Order" buttons
        this.confirmCancel = this.appendChild(new ConfirmCancel("Send Order", "Back"))
        this.confirmCancel.actions.cancel = () => {
            this.hidden = true
            this.onBack()
        }
        this.confirmCancel.actions.confirm = () => {
            this.hidden = true
            P(
                `Payment detail will be sent to <b class="money">${this.email.value}</b>
                            <br/><br/>Order will be processed upon receiving payment.
                            <br/><br/>Continue?`, () => this.onOrder())
        }

        this.update()
        this.onEmailChanged()
    }

    update() {
        this.headingItems.innerText = 'item'.times(api.cart.length)
        this.price.innerText = `\$${api.cart.price}`

        this.itemsContainer.removeChildren()

        api.cart.forEach((configuration, i) => {
            // Add item
            const cartItem = this.itemsContainer.appendChild(new CartItem(configuration))

            // Add horizontal separator line
            if (i < (api.cart.length - 1))
                this.itemsContainer.appendNew('hr')

            cartItem.onDeleted = () => {
                api.cart.remove(configuration)
                this.onConfigurationRemoved()
                this.update()
            }

            cartItem.onCountChanged = () => {
                this.price.innerText = `\$${api.cart.price}`
            }

            cartItem.partIcon.addEventListener('click', () => {
                // Select item as current
                configuration.select()
                api.currentConfigurator().configuration = configuration
                this.hidden = true
            })
        })
    }

    onEmailChanged() {
        this.confirmCancel.confirmButton.disabled = !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(this.email.value))
    }
}

customElements.define('app-cart-page', CartPage)
