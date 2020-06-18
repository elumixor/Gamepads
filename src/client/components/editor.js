import {PartIcon} from "./partIcon.js"
import {ConfirmCancel} from "./confirmCancel.js"
import {OptionIcon} from "./optionIcon.js"
import * as api from "../api.js"

export class Editor extends HTMLElement {
    connectedCallback() {
        this.partIcon = this.appendChild(new PartIcon())
        this.dimmer = this.appendNew('div', {class: 'dimmer'})
        this.optionsRoot = this.appendNew('div', {class: 'options'})
        this.confirmCancel = this.appendChild(new ConfirmCancel())
        this.onHide = () => {
        }
    }

    hide() {
        this.hidden = true
        this.onHide()
    }

    show() {
        this.hidden = false
    }

    select(configuration, [part, partName]) {
        // Save previous option in case of cancellation
        this.previousOption = configuration.selectedOptions[partName]

        // Register confirm/cancel callbacks
        this.confirmCancel.actions = {
            confirm: () => {
                this.hide()
            }, cancel: () => {
                if (!this.previousOption)
                    delete configuration.selectedOptions[partName]
                else
                    configuration.selectedOptions[partName] = this.previousOption
                api.currentConfigurator().update()
                this.hide()
            }
        }

        this.configuration = configuration
        this.partIcon.part = part

        const categories = {Basic: {}}

        part.options.iterate((optionName, option) => {
            const cat = categories[option.category || 'Basic']
            const price = cat[option.price] || (cat[option.price] = [])
            price.push(option)
        })

        this.optionsRoot.removeChildren()
        categories.iterate((categoryName, prices) => {
            const categoryRoot = this.optionsRoot.appendNew('div')
            const categoryNameEl = categoryRoot.appendNew('div', {class: 'category-name'})

            categoryNameEl.innerText = categoryName

            prices.iterate((price, options) => {
                const priceRoot = categoryRoot.appendNew('span')
                const priceEl = priceRoot.appendNew('span', {class: 'money'})
                priceEl.innerText = `\$${price}`

                const optionsRoot = priceRoot.appendNew('span')
                options.forEach(option => optionsRoot.appendChild(new OptionIcon(configuration, partName, option)))
            })
        })
    }
}
