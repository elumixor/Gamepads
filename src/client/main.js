import * as api from './api.js'
import * as util from "./util.js"
import {Configurator} from "./components/configuratorPage/configurator.js"
import {Editor} from "./components/editorPage/editor.js"
import {MainPage} from "./components/mainPage.js"
import {OrderButton} from "./components/configuratorPage/orderButton.js"
import {CartIcon} from "./components/configuratorPage/cartIcon.js"
import {CartPage} from "./components/cartPage/cartPage.js"

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
    cartIcon.update()

    const configurator = document.body.appendChild(new Configurator())
    api.currentConfigurator_(configurator)

    const orderButton = document.body.appendChild(new OrderButton())

    const editor = document.body.appendChild(new Editor())
    editor.hide()

    const cartPage = document.body.appendChild(new CartPage())
    cartPage.hidden = true

    configurator.onPartSelected = (configuration, part) => {
        editor.select(configuration, part)

        mainPage.hidden = true
        dom['cart-status'].hidden = true
        orderButton.hidden = true
        cartIcon.hidden = true

        editor.show()
    }

    configurator.onUpdated = (configuration) => {
        orderButton.price = configuration.price
    }

    editor.onHide = () => {
        configurator.zoomOut()

        mainPage.hidden = false
        orderButton.hidden = false
        dom['cart-status'].hidden = false
        cartIcon.hidden = false
    }

    mainPage.onProductSelected = (productName) => {
        mainPage.close()
        configurator.configuration = api.currentConfigurations[productName]
    }

    orderButton.onClick = () => {
        api.saveToCart(configurator.configuration)
        cartIcon.update()
        configurator.configuration = api.newConfiguration(api.data.keyOf(configurator.configuration.product))
    }

    cartIcon.onClick = () => {
        cartPage.update()
        cartPage.hidden = false
    }

    cartPage.onOrder = () => {
        util.post('order', api.cart)
        api.cart.length = 0
        cartIcon.update()
    }
    cartPage.onConfigurationRemoved = () => cartIcon.update()


    // load configurator with xbox, new configuration
    const productName = api.data.keys[0]
    configurator.configuration = api.currentConfigurations[productName] = api.newConfiguration(productName)

    // for each product, create configurator elements

})()
