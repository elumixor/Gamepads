import {PageComponent} from "./pageComponent.js"
import {ConfirmCancel} from "./confirmCancel.js"

class PromptComponent extends PageComponent {
    connectedCallback() {
        this.messageElement = this.appendNew('div')
        this.confirmCancel = this.appendChild(new ConfirmCancel("Yes", "No"))
        this.confirmCancel.actions.cancel = () => {
            this.hidden = true
        }
    }
}


customElements.define('app-prompt', PromptComponent)

let promptElement = document.body.appendChild(new PromptComponent())
promptElement.hidden = true

export function prompt(message, onYes) {
    promptElement.confirmCancel.actions.confirm = () => {
        onYes()
        promptElement.hidden = true
    }

    promptElement.messageElement.innerHTML = message
    promptElement.hidden = false
}
