export class Component extends HTMLElement {
    constructor() {
        super();

        this.setAttribute('custom-component', '')
    }
}

customElements.define('app-component', Component)
