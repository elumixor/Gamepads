import * as api from './api.js'
import * as util from "./util.js"
import {Configurator} from "./components/configurator.js"
import {Editor} from "./components/editor.js"
import {MainPage} from "./components/mainPage.js"
import {OrderButton} from "./components/orderButton.js"
import {CartIcon} from "./components/cartIcon.js"

// This dictionary object maps ids to dom objects
const dom = {}
util.walkDOM(document.body, node => {
    if (node.hasAttribute('id'))
        dom[node.id] = node
})


;(async function initialize() {
    await api.initialize()

    const mainPage = document.body.appendChild(new MainPage())
    const cartIcon = document.body.appendChild(new CartIcon())
    cartIcon.cart = api.cart

    const configurator = document.body.appendChild(new Configurator())
    api.currentConfigurator_(configurator)

    const orderButton = document.body.appendChild(new OrderButton())

    const editor = document.body.appendChild(new Editor())
    editor.hide()

    configurator.onPartSelected = (configuration, part) => {
        editor.select(configuration, part)

        mainPage.hidden = true
        dom['cart-status'].hidden = true

        editor.show()
    }

    configurator.onUpdated = (configuration) => {
        orderButton.price = configuration.price
    }

    editor.onHide = () => {
        configurator.zoomOut()

        mainPage.hidden = false
        dom['cart-status'].hidden = false
    }

    mainPage.onProductSelected = (productName) => {
        mainPage.close()
        configurator.configuration = api.currentConfigurations[productName]
    }

    // load configurator with xbox, new configuration
    const productName = api.data.keys[0]
    configurator.configuration = api.currentConfigurations[productName] = api.newConfiguration(productName)

    // for each product, create configurator elements

})()
