import * as api from './api.js'
import * as util from "./util.js"
import {E} from './elements.js'
import {Responsive} from "./components/responsive.js"
import {Component} from "./components/component.js"
import * as language from './localization.js'


const responsive = [...document.querySelectorAll('[data-responsive]')]
    .filter(n => n instanceof Component);

util.responsiveElement(() => {
        responsive.forEach(n => n.onMobile())
        E['links-container'].setAttribute('data-mobile', '')
        E['order-buttons'].setAttribute('data-mobile', '')
    },
    () => {
        responsive.forEach(n => n.onDesktop())
        E['links-container'].removeAttribute('data-mobile')
        E['order-buttons'].removeAttribute('data-mobile')
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

    language.select('en')
})()
