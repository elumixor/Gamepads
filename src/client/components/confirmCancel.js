export class ConfirmCancel extends HTMLElement {
    constructor(confirmText = "Confirm", cancelText = "Cancel") {
        super();

        this.confirmText = confirmText
        this.cancelText = cancelText

        this.actions = {confirm: () => {}, cancel: () => {}}
    }

    connectedCallback() {
        this.confirmButton = this.appendNew('button', {class: 'confirm'})
        this.confirmButton.innerText = this.confirmText

        this.cancelButton = this.appendNew('button', {class: 'cancel'})
        this.cancelButton.innerText = this.cancelText

        this.confirmButton.addEventListener('click', () => this.confirm())
        this.cancelButton.addEventListener('click', () => this.cancel())
    }

    confirm() {
        this.actions.confirm()
    }

    cancel() {
        this.actions.cancel()
    }
}
