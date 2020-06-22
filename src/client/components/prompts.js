import {PageComponent} from "./pageComponent.js"
import {ConfirmCancel} from "./confirmCancel.js"

class PromptComponent extends PageComponent {
    connectedCallback() {
        const content = this.appendNew('div')
        this.messageElement = content.appendNew('div')
        this.confirmCancel = content.appendChild(new ConfirmCancel("Yes", "No"))
    }
}


customElements.define('app-prompt', PromptComponent)

let promptElement = document.body.appendChild(new PromptComponent())
promptElement.hidden = true

export function prompt(message, onYes, onNo = () => {}) {
    promptElement.confirmCancel.actions.confirm = () => {
        onYes()
        promptElement.hidden = true
    }
    promptElement.confirmCancel.actions.cancel = () => {
        onNo()
        promptElement.hidden = true
    }

    promptElement.messageElement.innerHTML = message
    promptElement.hidden = false
}
