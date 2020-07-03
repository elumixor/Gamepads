import {Component} from "./component.js"
import {OptionIcon} from "./optionIcon.js"
import {getPrice} from "../localization.js"

export class PartOptions extends Component {
    constructor() {
        super()

        this.selectedPart = undefined
    }

    connectedCallback() {
        const categories = {Basic: {}}
        this.selectedPart.options.iterate((optionName, option) => {
            const categoryName = option.category || 'Basic'
            const cat = categories[categoryName] || (categories[categoryName] = [])
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
                priceEl.innerText = `${getPrice(price)}`

                const optionsRoot = priceRoot.appendNew('span')
                options.forEach(option => optionsRoot.appendChild(
                    new OptionIcon(this.selectedPart.name, option)))
            })
        })
    }
}

customElements.define('app-part-options', PartOptions)

