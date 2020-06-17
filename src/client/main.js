import * as api from './api.js'
import {Configurator} from "./configurator.js"
import * as util from "./util.js"

// This dictionary object maps ids to dom objects
const dom = {}
util.walkDOM(document.body, node => {
    if (node.hasAttribute('id'))
        dom[node.id] = node
})

// class Editor {
//     constructor(rootElement) {
//         this.element = rootElement
//         this.buildDom()
//
//         // create dimmer, part icon
//         this.dimmer = document.createElement('div')
//
//         this.partIcon = {
//             icon: document.createElement('div')
//         }
//
//         this.element.appendChild(this.dimmer)
//     }
//
//     async buildDom() {
//         const {element: icon, ids} = await util.buildDom('components/partIcon.html')
//         this.element.appendChild(icon)
//         this.icon = ids
//     }
//
//     show(configuration, selectedPart) {
//         console.log(configuration, selectedPart)
//
//         // show dimmer
//         // set icon image, text, options
//         // set categories (create?)
//     }
// }
class PartIcon extends HTMLElement {
    constructor() {
        super();

        this.imageElement = document.createElement('img')
        this.imageElement.alt = ''
        this.dimmerElement = document.createElement('div')
        this.dimmerElement.classList.add('dimmer')

        this.patNameElement = document.createElement('div')
        this.patNameElement.classList.add('part-name')

        this.optionsCountElement = document.createElement('div')
        this.optionsCountElement.classList.add('options-count')
    }

    set part(newPart) {
        this.imageElement.src = newPart.icon
        this.patNameElement.innerText = newPart.displayName

        const optionsCount = newPart.options.length
        const suffix = optionsCount === 11 || optionsCount % 10 !== 1 ? 's' : ''

        this.optionsCountElement.innerText = `${optionsCount} option${suffix}`
    }

    connectedCallback() {
        this.appendChild(this.imageElement)
        this.appendChild(this.dimmerElement)
        this.appendChild(this.patNameElement)
        this.appendChild(this.optionsCountElement)
    }
}

class OptionIcon extends HTMLElement {
    constructor(option) {
        super();

        this.option = option
    }
}

class ConfirmCancel extends HTMLElement {
    constructor(confirmText = "Confirm", cancelText = "Cancel") {
        super();

        this.confirmText = confirmText
        this.cancelText = cancelText
    }

    connectedCallback() {
        this.confirmButton = this.appendNew('button')
        this.confirmButton.classList.add('confirm')
        this.confirmButton.innerText = this.confirmText

        this.cancelButton = this.appendNew('button')
        this.cancelButton.classList.add('cancel')
        this.cancelButton.innerText = this.cancelText
    }
}

class Editor extends HTMLElement {
    connectedCallback() {
        this.partIcon = this.appendChild(new PartIcon())

        this.dimmer = this.appendChild(document.createElement('div'))
        this.dimmer.classList.add('dimmer')

        this.optionsRoot = this.appendChild(document.createElement('div'))
        this.optionsRoot.classList.add('options')

        this.confirmCancel = this.appendChild(new ConfirmCancel())
    }

    hide() {
        this.hidden = true
    }

    show() {
        this.hidden = false
    }

    select(configuration, [partName, selectedOption]) {
        const part = configuration.product.parts[partName]

        this.partIcon.part = part

        // categories -> prices -> options
        const categories = {Basic: {}}

        part.options.iterate((optionName, option) => {
            const cat = categories[option.category || 'Basic']
            const price = cat[option.price] || (cat[option.price] = [])
            price.push(option)
        })

        categories.iterate((categoryName, prices) => {
            const categoryRoot = this.optionsRoot.appendNew('div')
            const categoryNameEl = categoryRoot.appendNew('div')
            categoryNameEl.classList.add('category-name')
            categoryNameEl.innerText = categoryName

            prices.iterate((price, options) => {
                const priceRoot = categoryRoot.appendNew('span')
                const priceEl = priceRoot.appendNew('span')
                priceEl.classList.add('money', 'price')
                priceEl.innerText = `\$${price}`

                const optionsRoot = priceRoot.appendNew('span')
                options.forEach(option => optionsRoot.appendChild(new OptionIcon(option)))
            })

        })

        // display options
        // get categories
        // within categories, get prices
        // create div and text elements

        // transform each option into an element
        // append them to price spans
        // append them to categories
        // append them to this.optionsRoot()
        // console.log(part.options)
        // console.log(configuration, partName, selectedOption)
    }
}

window.customElements.define('app-editor', Editor)
window.customElements.define('app-part-icon', PartIcon)
window.customElements.define('app-option-icon', OptionIcon)
window.customElements.define('app-confirm-cancel', ConfirmCancel)


;(async function initialize() {
    await api.initialize()

    const config = api.newConfiguration(Object.keys(api.data)[0])

    const editor = document.body.appendChild(new Editor())
    editor.hidden = true

    editor.select(config, config.selectedOptions.toArray[0])

    const configurator = new Configurator(dom['configurator'], api.data['xbox'], editor.show)

    // load configurator with xbox, new configuration
    configurator.loadConfiguration(config)


    // for each product, create configurator elements

})()
