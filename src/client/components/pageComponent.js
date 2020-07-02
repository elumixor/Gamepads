import {Component} from "./component.js"
import {Responsive} from "./responsive.js"

export class PageComponent extends Responsive(Component) {
    constructor() {
        super();

        this.setAttribute('data-page-component', '')
    }
}
