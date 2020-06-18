export class OrderButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.text = this.appendNew('span')
        this.text.innerText = 'Order for '
        this.priceEl = this.appendNew('span', {class: 'money'})
    }

    set price(newPrice) {
        this.priceEl.innerText = `\$${newPrice}`
    }
}

window.customElements.define('app-order-button', OrderButton)

