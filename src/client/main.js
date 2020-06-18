import * as api from './api.js'
import * as util from "./util.js"
import {Configurator} from "./components/configurator.js"
import {PartIcon} from "./components/partIcon.js"
import {OptionIcon} from "./components/optionIcon.js"
import {ConfirmCancel} from "./components/confirmCancel.js"
import {Editor} from "./components/editor.js"

// This dictionary object maps ids to dom objects
const dom = {}
util.walkDOM(document.body, node => {
    if (node.hasAttribute('id'))
        dom[node.id] = node
})


window.customElements.define('app-editor', Editor)
window.customElements.define('app-part-icon', PartIcon)
window.customElements.define('app-option-icon', OptionIcon)
window.customElements.define('app-confirm-cancel', ConfirmCancel)
window.customElements.define('app-configurator', Configurator)

;(async function initialize() {
    await api.initialize()


    const configurator = document.body.appendChild(new Configurator())
    api.currentConfigurator_(configurator)

    const editor = document.body.appendChild(new Editor())
    editor.hide()

    configurator.onPartSelected = (configuration, part) => {
        editor.select(configuration, part)

        dom['logo'].hidden = true
        dom['cart-status'].hidden = true

        editor.show()
    }


    // load configurator with xbox, new configuration
    configurator.configuration = api.newConfiguration(Object.keys(api.data)[0])

    // for each product, create configurator elements

})()
