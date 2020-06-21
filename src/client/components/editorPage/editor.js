import {PartIcon} from "./partIcon.js"
import {ConfirmCancel} from "../confirmCancel.js"
import * as api from "../../api.js"
import {PartOptions} from "../partOptions.js"

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

        this.optionsRoot.appendChild(new PartOptions(configuration, part))
    }
}

window.customElements.define('app-editor', Editor)
