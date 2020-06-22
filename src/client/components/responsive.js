// Mixin for another component
export const Responsive = (C) => class extends C {
    constructor() {
        super();
        this.setAttribute('data-responsive', '')
    }

    onChanged() {
    }

    onMobile() {
        this.setAttribute('data-mobile', '')
        this.onChanged()
    }

    onDesktop() {
        this.removeAttribute('data-mobile')
        this.onChanged()
    }
}
