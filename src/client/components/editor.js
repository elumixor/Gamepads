import {Component} from "./component.js"
import {Icon} from "./icon.js"
import {PartOptions} from "./partOptions.js"
import {Responsive} from "./responsive.js"
import {changeEvent, currentConfiguration as C} from "../api.js"
import {ConfirmCancel} from "./confirmCancel.js"
import {E} from "../elements.js"

export class Editor extends Responsive(Component) {
    constructor() {
        super();

        changeEvent.subscribe(configuration => {
            if (configuration.product === this.product) return

            this.product = configuration.product

            // Fill parts container with parts icons
            this.partsContainer.removeChildren()
            const parts = configuration.product.parts
            this.icons = {}
            parts.values.forEach(part => {
                const icon = this.partsContainer.appendChild(new Icon(part.icon, part.displayName, 'option'.times(part.options.length)))

                icon.onclick = () => this.select(part)
                this.icons[part.name] = icon
            })

            // Select first option as default
            this.select(parts.first)
        })
    }

    connectedCallback() {
        super.connectedCallback();

        this.partsContainer = this.appendNew('div', {class: 'parts-container'})
        this.optionsContainer = this.appendNew('div', {class: 'options-container'})
        this.confirmCancel = this.appendChild(new ConfirmCancel())
        this.confirmCancel.actions = {
            confirm: () => {
                E['part-selector'].zoomOut()
            },
            cancel: () => {
                if (!this.previous.option) // if undefined = no option
                    delete C().selectedOptions[this.previous.partName]
                else
                    C().selectedOptions[this.previous.partName] = this.previous.option

                E['part-selector'].zoomOut()
            }
        }
    }

    select(part) {
        // Disable selected for all part icons except selected one
        for (const i of this.icons.values) i.removeAttribute('data-selected')
        this.icons[part.name].setAttribute('data-selected', '')

        // Store previous value to rollback
        this.previous = {partName: part.name, option: C().selectedOptions[part.name]}

        // Fill the options container with selected part options
        this.optionsContainer.removeChildren()
        const partIcon = new PartOptions()
        partIcon.selectedPart = part
        this.optionsContainer.appendChild(partIcon)
    }
}

