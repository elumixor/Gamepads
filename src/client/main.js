import * as api from './api.js'
import * as util from './util.js'
import {E} from './elements.js'
import {Responsive} from './components/responsive.js'
import {Component} from './components/component.js'
import * as language from './localization.js'
import {Dropbox} from './components/dropbox.js'


const responsive = [...document.querySelectorAll('[data-responsive]')]
    .filter(n => n instanceof Component)

util.responsiveElement(() => {
        responsive.forEach(n => n.onMobile())
        E['gamepads'].setAttribute('data-mobile', '')
        E['airpods'].setAttribute('data-mobile', '')
        E['order-buttons'].setAttribute('data-mobile', '')
    },
    () => {
        responsive.forEach(n => n.onDesktop())
        E['gamepads'].removeAttribute('data-mobile')
        E['airpods'].removeAttribute('data-mobile')
        E['order-buttons'].removeAttribute('data-mobile')
    })

;(async function initialize() {
    // 1. Get necessary data from the server
    await api.fetchData()

    // Create links to a product
    const categories = {}

    api.products.values.forEach(product => {
        if (!categories[product.category]) categories[product.category] = [product]
        else categories[product.category].push(product)
    })

    categories.iterate((category, products) => {
        if (category === 'airpods') return
        const dropbox = new Dropbox(Object.assign({}, ...products.map(product => ({[product.displayName]: () => new api.Configuration(product).select()}))))

        document.body.appendChild(dropbox)

        let linkElement = E[category]
        linkElement.onmouseenter = () => {
            dropbox.hidden = false
            const top = linkElement.offsetTop + linkElement.offsetHeight
            const left = linkElement.offsetLeft + linkElement.offsetWidth / 2 - dropbox.offsetWidth / 2
            dropbox.style.left = left + 'px'
            dropbox.style.top = top + 'px'
        }

        linkElement.onmouseleave = e => {
            if (!e.isAbove(dropbox))
                dropbox.hidden = true
        }

        dropbox.onmouseleave = e => {
            if (!e.isAbove(linkElement))
                dropbox.hidden = true
        }

        dropbox.hidden = true
    })

    language.select('en')
})()



