export class ConfirmCancel extends HTMLElement {
    constructor(confirmText = "Confirm", cancelText = "Cancel") {
        super();

        this.confirmText = confirmText
        this.cancelText = cancelText

        this.actions = {
            confirm: () => {},
            cancel: () => {}
        }
    }

    connectedCallback() {
        this.cancelButton = this.appendNew('button', {class: 'cancel'})
        this.cancelButton.innerText = this.cancelText

        this.confirmButton = this.appendNew('button', {class: 'confirm'})
        this.confirmButton.innerText = this.confirmText

        this.confirmButton.addEventListener('click', () => this.confirm())
        this.cancelButton.addEventListener('click', () => this.cancel())
    }

    get disabled() {
        return this.confirmButton.disabled
    }

    set disabled(d) {
        this.confirmButton.disabled = d
    }

    confirm() {
        if (!this.disabled)
            this.actions.confirm()
    }

    cancel() {
        this.actions.cancel()
    }
}

window.customElements.define('app-confirm-cancel', ConfirmCancel)
