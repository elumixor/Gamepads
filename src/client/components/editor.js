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

                icon.onclick = () => this.selectPart(part)
                this.icons[part.name] = icon
            })

            // Select first option as default
            this.selectPart(parts.first)
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
                C().selectOption(this.previous.partName, this.previous.option)
                E['part-selector'].zoomOut()
            }
        }
    }

    selectPart(part) {
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

        // changeEvent.dispatch(C())
    }
}

