import {PartSelector} from "./components/configuratorPage/partSelector.js"
import {MainPage} from "./components/mainPage.js"
import {OrderButton} from "./components/orderButton.js"
import {CartIcon} from "./components/cartIcon.js"
import {CartPage} from "./components/cartPage/cartPage.js"
import {Editor} from "./components/editor.js"
import {Component} from "./components/component.js"
import * as util from "./util.js"
import {Icon} from "./components/icon.js"

// Register components
customElements.define('app-part-selector', PartSelector)
customElements.define('app-main-page', MainPage)
customElements.define('app-order-button', OrderButton)
customElements.define('app-cart-icon', CartIcon)
customElements.define('app-cart-page', CartPage)
customElements.define('app-editor', Editor)
customElements.define('app-icon', Icon)

// This dictionary object maps ids to dom elements so we can access them as dom['element-id']
export const E = {}

// Put all the elements by id
util.walkDOM(document.body, node => {
    if (node.hasAttribute('id'))
        E[node.id] = node

    if (node instanceof Component) {
        let componentName = node.localName.slice(4)
        if (node.hasAttribute("data-duplicate")) {
            if (!E[componentName]) E[componentName] = {}

            E[componentName][node.id] = node
        } else
            E[componentName] = node
    }
})
