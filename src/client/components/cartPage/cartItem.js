import {Component} from "../component.js"
import {PartIcon} from "../editorPage/partIcon.js"
import {Counter} from "./counter.js"
import {prompt as P} from "../prompts.js"

export class CartItem extends Component {
    constructor(configuration) {
        super();

        this.configuration = configuration
        this.onDeleted = () => {
        }
        this.onCountChanged = () => {
        }
    }

    connectedCallback() {
        super.connectedCallback();

        // Configure part icon
        this.partIcon = this.appendChild(new PartIcon())

        const product = this.configuration.product

        this.partIcon.imageElement.src = product.icon
        this.partIcon.partNameElement.innerText = product.displayName
        this.partIcon.optionsCountElement.innerText = 'mod'.times(this.configuration.selectedOptions.length)

        // Configure item count component
        this.itemCount = this.appendChild(new Counter())

        // Configure price text
        this.priceText = this.appendNew('span', {class: 'money'})
        this.itemCount.onCountChanged = (newCount) => {
            if (newCount < 1) this.itemCount.count = 1
            else {
                this.configuration.count = newCount
                this.priceText.innerText = `\$${newCount * this.configuration.price}`
                this.onCountChanged()
            }
        }
        this.itemCount.count = this.configuration.count

        // Configure delete button
        this.deleteButton = this.appendNew('img', {src: 'images/cross.svg', alt: ''})
        this.deleteButton.addEventListener('click', () => {
            P('Delete this item from the cart?', () => this.onDeleted())
        })
    }
}

customElements.define('app-cart-item', CartItem)
