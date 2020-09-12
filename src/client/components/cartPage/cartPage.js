import {PageComponent} from '../pageComponent.js'
import * as api from '../../api.js'
import {E} from '../../elements.js'
import {ConfirmCancel} from '../confirmCancel.js'
import {CartItem} from './cartItem.js'
import {prompt as P} from '../prompts.js'
import {Responsive} from '../responsive.js'
import {getPrice} from '../../localization.js'

export class CartPage extends Responsive(PageComponent) {
    constructor() {
        super()
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

        // "Back" and "Send Order" buttons
        this.confirmCancel = this.appendChild(new ConfirmCancel('Continue', 'Back'))
        this.confirmCancel.actions.cancel = () => this.hidden = true
        this.confirmCancel.actions.confirm = () => {
            this.hidden = true
            P(`
                    <p>Please fill in your contact details</p>
                    
                    <div>
                    <label class="user-input-label" for="user-input-fname">First name</label><br>
                    <input class="user-input" type="fname" id="user-input-fname" placeholder="John"/>
                    
                    <br>
                    <label class="user-input-label" for="user-input-lname">Last name</label><br>
                    <input class="user-input" type="lname" id="user-input-lname" placeholder="Doe"/>
                    
                    <br>
                    <label class="user-input-label" for="user-input-address">Address for delivery</label><br>
                    <input class="user-input" type="text" id="user-input-address" placeholder="Your St. 12"/>
                    
                    <br>
                    <label class="user-input-label" for="user-input-tel">Phone number</label><br>
                    <input class="user-input" type="tel" id="user-input-tel" placeholder="123-123-123"/>
                    
                    <br>
                    <label class="user-input-label" for="user-input-email">Email</label><br>
                    <input class="user-input" type="email" id="user-input-email" placeholder="your@mail.com"/>
                    </div>
                    
                    <style>
                        .user-input {
                            margin-bottom: 20px;
                            padding-bottom: 0;
                            text-align: left;
                            width: 100%;
                            border-bottom: 2px dotted;
                            font-family: "Courier New";
                            font-size: 0.9em;
                        }
                        
                        .user-input-label {
                            width: 100%;
                            text-align: left;
                            display: inline-block;
                            font-size: 0.66em;                           
                        }
                    </style>
                `, () => {

                const [fname, lname, address, tel, email] = ['fname', 'lname', 'address', 'tel', 'email']
                    .map(t => document.getElementById('user-input-' + t).value)

                const userData = {fname, lname, address, tel, email}


                const emailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    .test(email)

                if (!emailValid) return

                P(`Payment detail will be sent to <b class="money">${email}</b>
                            <br/><br/>Order will be processed upon receiving payment.
                            <br/><br/>Continue?`, () => {
                    api.sendOrder(userData)
                    this.update()
                    E['cart-icon'].update()
                }, () => this.hidden = false)
            }, (p) => {
                this.hidden = false
                p.hidden = true
            }, 'Confirm', 'Cancel', true)
        }

        // Validate email
        this.validateCart()

        // Hide cart by default
        this.hidden = true

        addEventListener('click', e => {
            if (!this.hidden && !e.isAbove(this)) {
                this.hidden = true
            }
        })
    }

    update() {
        this.headingItems.innerText = 'item'.times(api.cart.length)
        this.price.innerText = `${getPrice(api.cart.price)}`

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
        this.confirmCancel.disabled = api.cart.empty
    }
}

