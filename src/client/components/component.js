export class Component extends HTMLElement {
    constructor() {
        super();

        this.setAttribute('data-custom-component', '')
    }

    connectedCallback() {
    }
}

customElements.define('app-component', Component)
