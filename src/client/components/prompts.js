import {PageComponent} from './pageComponent.js'
import {ConfirmCancel} from './confirmCancel.js'

class PromptComponent extends PageComponent {
    connectedCallback() {
        const content = this.appendNew('div')
        this.messageElement = content.appendNew('div')
        this.confirmCancel = content.appendChild(new ConfirmCancel('Yes', 'No'))
    }

    set hidden(value) {
        if (value) this.setAttribute('hidden', '')
        else this.removeAttribute('hidden')
    }
}


customElements.define('app-prompt', PromptComponent)

let promptElement = document.body.appendChild(new PromptComponent())
promptElement.hidden = true

export function prompt(message, onYes, onNo = () => {}, yes = 'Yes', no = 'No', dontHide = false) {
    const confirmCancel = promptElement.confirmCancel
    confirmCancel.confirmButton.innerText = yes
    confirmCancel.cancelButton.innerText = no

    confirmCancel.actions.confirm = () => {
        onYes(promptElement)

        if (!dontHide)
            promptElement.hidden = true
    }
    confirmCancel.actions.cancel = () => {
        onNo(promptElement)

        if (!dontHide)
            promptElement.hidden = true
    }

    promptElement.messageElement.innerHTML = message
    promptElement.hidden = false
}
