import * as api from './api.js'
import * as util from "./util.js"
import {E, components} from './elements.js'
import {Responsive} from "./components/responsive.js"
import {Component} from "./components/component.js"


const responsive = [...document.querySelectorAll('[data-responsive]')]
    .filter(n => n instanceof Component);

util.responsiveElement(() => {
        responsive.forEach(n => n.onMobile())
        E['links-container'].setAttribute('data-mobile', '')
    },
    () => {
        responsive.forEach(n => n.onDesktop())
        E['links-container'].removeAttribute('data-mobile')
    })

;(async function initialize() {
    // 1. Get necessary data from the server
    await api.fetchData()

    // Create links to a product
    api.products.values.forEach(product => {
        const productLink = E['links-container'].appendNew('div', {class: 'product-link'})
        productLink.innerText = product.displayName
        productLink.onclick = () => new api.Configuration(product).select()
    })

    // function selectMobile(configuration, part) {
    //     editor.select(configuration, part)
    //
    //     mainPage.hidden = true
    //     dom['cart-status'].hidden = true
    //     orderButton.hidden = true
    //     cartIcon.hidden = true
    //
    //     editor.show()
    // }
    //
    // function hideMobile() {
    //     configurator.zoomOut()
    //
    //     mainPage.hidden = false
    //     orderButton.hidden = false
    //     dom['cart-status'].hidden = false
    //     cartIcon.hidden = false
    // }
    //
    // function selectDesktop(configuration, part) {
    //     desktopEditor.select(configuration, part)
    // }
    //
    // configurator.onPartSelected = (configuration, part) => {
    //     if (util.isMobile()) selectMobile(configuration, part)
    //     else selectDesktop(configuration, part)
    // }
    //
    // configurator.onUpdated = (configuration) => {
    //     orderButton.price = configuration.price
    // }
    //
    // editor.onHide = () => {
    //     hideMobile()
    // }
    //
    // mainPage.onProductSelected = (productName) => {
    //     mainPage.close()
    //     configurator.configuration = api.currentConfigurations[productName]
    // }
    //
    // orderButton.onClick = () => {
    //     api.saveToCart(configurator.configuration)
    //     cartIcon.update()
    //     configurator.configuration = api.newConfiguration(api.data.keyOf(configurator.configuration.product))
    // }
    //
    // cartIcon.onClick = () => {
    //     cartPage.update()
    //     cartPage.hidden = false
    // }
    //
    // cartPage.onOrder = () => {
    //     util.post('order', api.cart)
    //     api.cart.length = 0
    //     cartIcon.update()
    // }
    // cartPage.onConfigurationRemoved = () => cartIcon.update()
})()
