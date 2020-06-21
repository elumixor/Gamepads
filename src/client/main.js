import * as api from './api.js'
import * as util from "./util.js"
import {Configurator} from "./components/configuratorPage/configurator.js"
import {Editor} from "./components/editorPage/editor.js"
import {MainPage} from "./components/mainPage.js"
import {OrderButton} from "./components/configuratorPage/orderButton.js"
import {CartIcon} from "./components/configuratorPage/cartIcon.js"
import {CartPage} from "./components/cartPage/cartPage.js"
import {DesktopEditor} from "./components/desktopEditor.js"

// This dictionary object maps ids to dom objects
const dom = {}
util.walkDOM(document.body, node => {
    if (node.hasAttribute('id'))
        dom[node.id] = node
})


;(async function initialize() {
    await api.initialize()
    const productName = api.data.keys[0]
    api.currentConfigurations[productName] = api.newConfiguration(productName)

    const mainPage = document.body.appendChild(new MainPage())

    const cartIcon = document.body.appendChild(new CartIcon())
    cartIcon.update()

    const configurator = document.body.appendChild(new Configurator())
    api.currentConfigurator_(configurator)
    configurator.configuration = api.currentConfigurations[productName]

    const orderButton = document.body.appendChild(new OrderButton())

    const editor = document.body.appendChild(new Editor())
    editor.hide()

    const cartPage = document.body.appendChild(new CartPage())
    cartPage.hidden = true

    const desktopEditor = document.body.appendChild(new DesktopEditor())

    function selectMobile(configuration, part) {
        editor.select(configuration, part)

        mainPage.hidden = true
        dom['cart-status'].hidden = true
        orderButton.hidden = true
        cartIcon.hidden = true

        editor.show()
    }

    function hideMobile() {
        configurator.zoomOut()

        mainPage.hidden = false
        orderButton.hidden = false
        dom['cart-status'].hidden = false
        cartIcon.hidden = false
    }

    function selectDesktop(configuration, part) {
        desktopEditor.select(configuration, part)
    }

    configurator.onPartSelected = (configuration, part) => {
        if (util.isMobile()) selectMobile(configuration, part)
        else selectDesktop(configuration, part)
    }

    configurator.onUpdated = (configuration) => {
        orderButton.price = configuration.price
    }

    editor.onHide = () => {
        hideMobile()
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

    function* responsiveElements() {
        yield editor
        yield desktopEditor
        yield configurator
        yield orderButton
        yield cartPage
    }

    util.responsiveElement(() => {
        for (const el of responsiveElements())
            el.removeAttribute('data-desktop')
    }, () => {
        for (const el of responsiveElements())
            el.setAttribute('data-desktop', '')
    })
})()
