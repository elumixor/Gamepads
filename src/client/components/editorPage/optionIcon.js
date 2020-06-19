import * as api from '../../api.js'

export class OptionIcon extends HTMLElement {
    constructor(configuration, partName, option) {
        super();

        this.addEventListener('click', () => {
            configuration.selectedOptions[partName] = option
            api.currentConfigurator().update()
        })
    }
}

window.customElements.define('app-option-icon', OptionIcon)
