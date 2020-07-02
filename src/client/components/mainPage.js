import * as api from '../api.js'
import * as util from '../util.js'
import {Responsive} from "./responsive.js"
import {Component} from "./component.js"
import * as language from "../language.js"

export class MainPage extends Responsive(Component) {
    constructor() {
        super();

        this.isOpen = true
        api.dataLoadedEvent.subscribe(products => this.dataLoadedCallback(products))
    }

    connectedCallback() {
        this.bg = this.appendNew('div', {class: 'background'})

        this.logo = this.appendNew('img', {src: './images/logo.jpg'})

        this.languages = this.appendNew('div', {class: 'languages'})

        language.supported.forEach(lang => {
            const el = this.languages.appendNew('div', {class: 'language'})
            el.innerText = lang.capitalize
            el.setAttribute('data-language', lang)
            el.onclick = () => language.select(lang)
        })

        this.panels = this.appendNew('div', {class: 'panels'})
    }

    onMobile() {
        super.onMobile();
        this.logo.onclick = () => {
            if (this.isOpen) this.close()
            else this.open()
        }
    }

    onDesktop() {
        super.onDesktop();
        this.close()
        this.logo.onclick = () => {}
    }

    dataLoadedCallback(products) {
        const dynamicColors = (function* () {
            while (true) {
                yield 'var(--accent-dark)'
                yield 'var(--background-dark)'
            }
        })()

        products.values.forEach(product => {
            const panel = this.panels.appendNew('div')
            panel.style.backgroundColor = dynamicColors.next().value

            const t1 = panel.appendNew('div')
            t1.innerText = product.textBefore

            const t2 = panel.appendNew('div', {class: 'product'})
            t2.innerText = product.displayName

            const t3 = panel.appendNew('div')
            t3.innerText = product.textAfter

            panel.onclick = () => {
                new api.Configuration(product).select()
                this.close()
            }
        })
    }

    open() {
        this.isOpen = true
        this.setAttribute('open', '')
    }

    close() {
        this.isOpen = false
        this.removeAttribute('open')
    }
}

