import * as api from '../api.js'
import * as util from '../util.js'

export class MainPage extends HTMLElement {
    constructor() {
        super();

        this.isOpen = true
        this.onProductSelected = () => {
        }
    }

    connectedCallback() {
        this.bg = this.appendNew('div', {class: 'background'})

        this.logo = this.appendNew('img', {src: './images/logo.jpg'})

        this.languages = this.appendNew('div', {class: 'languages'})

        const en = this.languages.appendNew('div', {class: 'language'})
        en.innerText = 'En'

        const ru = this.languages.appendNew('div', {class: 'language'})
        ru.innerText = 'Ru'

        const cz = this.languages.appendNew('div', {class: 'language'})
        cz.innerText = 'Cz'

        this.panels = this.appendNew('div', {class: 'panels'})

        api.data.iterate((productName, product) => {
            const panel = this.panels.appendNew('div')

            const t1 = panel.appendNew('div')
            t1.innerText = product.textBefore

            const t2 = panel.appendNew('div', {class: 'product'})
            t2.innerText = product.displayName

            const t3 = panel.appendNew('div')
            t3.innerText = product.textAfter

            panel.addEventListener('click', () => {
                this.onProductSelected(productName)
            })
        })

        util.responsiveElement(() => {
            this.logo.onclick = () => {
                if (this.isOpen) this.close()
                else this.open()
            }
        }, () => {
            if (this.isOpen) this.close()
            this.logo.onclick = () => {
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

window.customElements.define('app-main-page', MainPage)
