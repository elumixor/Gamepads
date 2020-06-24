import {Component} from "./component.js"
import {OptionIcon} from "./optionIcon.js"

export class PartOptions extends Component {
    constructor(part) {
        super()

        this.selectedPart = part
    }

    connectedCallback() {
        const categories = {Basic: {}}
        this.selectedPart.options.iterate((optionName, option) => {
            const cat = categories[option.category || 'Basic']
            const price = cat[option.price] || (cat[option.price] = [])
            price.push(option)
        })

        this.removeChildren()
        categories.iterate((categoryName, prices) => {
            const categoryRoot = this.appendNew('div')
            const categoryNameEl = categoryRoot.appendNew('div', {class: 'category-name'})

            categoryNameEl.innerText = categoryName

            prices.iterate((price, options) => {
                const priceRoot = categoryRoot.appendNew('div')
                const priceEl = priceRoot.appendNew('span', {class: 'money'})
                priceEl.innerText = price > 0 ? `\$${price}` : 'Free'

                const optionsRoot = priceRoot.appendNew('span')
                options.forEach(option => optionsRoot.appendChild(
                    new OptionIcon(this.part.name, option)))
            })
        })
    }
}

customElements.define('app-part-options', PartOptions)

