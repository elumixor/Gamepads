export class ConfirmCancel extends HTMLElement {
    constructor(confirmText = "Confirm", cancelText = "Cancel") {
        super();

        this.confirmText = confirmText
        this.cancelText = cancelText
    }

    connectedCallback() {
        this.confirmButton = this.appendNew('button')
        this.confirmButton.classList.add('confirm')
        this.confirmButton.innerText = this.confirmText

        this.cancelButton = this.appendNew('button')
        this.cancelButton.classList.add('cancel')
        this.cancelButton.innerText = this.cancelText
    }
}
