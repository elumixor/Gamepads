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
export const components = []

// Put all the elements by id
util.walkDOM(document.body, node => {
    if (node.hasAttribute('id'))
        E[node.id] = node
})

// Put all the custom components
for (const c of document.body.children) {
    if (c instanceof Component) {
        E[c.localName.slice(4)] = c
        components.push(c)
    }
}
