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

class Editor extends HTMLElement {
    connectedCallback() {
        this.partIcon = this.appendChild(new PartIcon())
    }

    show() {

    }

    select(configuration, [partName, selectedOption]) {
        const part = configuration.product.parts[partName]

        this.partIcon.part = part

        // display options
        // console.log(configuration, partName, selectedOption)
    }
}

window.customElements.define('app-editor', Editor);
window.customElements.define('app-part-icon', PartIcon);


;(async function initialize() {
    await api.initialize()

    const config = api.newConfiguration(Object.keys(api.data)[0])

    const editor = document.body.appendChild(new Editor())

    editor.select(config, config.selectedOptions.toArray[0])

    const configurator = new Configurator(dom['configurator'], api.data['xbox'], editor.show)

    // load configurator with xbox, new configuration
    configurator.loadConfiguration(config)


    // for each product, create configurator elements

})()
