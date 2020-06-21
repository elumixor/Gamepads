import {Component} from "./component.js"
import * as api from "../api.js"
import {PartIcon} from "./editorPage/partIcon.js"
import {PartOptions} from "./partOptions.js"

export class DesktopEditor extends Component {
    connectedCallback() {
        super.connectedCallback();

        this.partsContainer = this.appendNew('div')
        this.optionsContainer = this.appendNew('div')

        this.updateConfiguration()
    }


    select(configuration, part) {
        console.log(part)
        console.log(configuration)
        // Fill the options container with selected part options
        this.optionsContainer.removeChildren()
        this.optionsContainer.appendChild(new PartOptions(configuration, part))
    }

    updateConfiguration() {
        const configuration = api.currentConfiguration()

        // Fill parts container with parts icons
        this.partsContainer.removeChildren()
        const parts = configuration.product.parts
        parts.iterate((partName, part) => {
            const partIcon = new PartIcon()
            partIcon.part = part
            this.partsContainer.appendChild(partIcon)
        })

        // Select first option as default
        this.select(configuration, parts.first)
    }
}

customElements.define('app-desktop-editor', DesktopEditor)
