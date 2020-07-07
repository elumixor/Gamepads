// Mixin for another component
export const Responsive = (C) => class extends C {
    constructor() {
        super();
        this.setAttribute('data-responsive', '')
        this.mobileView = false;
    }

    onChanged() {
    }

    onMobile() {
        this.setAttribute('data-mobile', '')
        this.mobileView = true;
        this.onChanged()
    }

    onDesktop() {
        this.removeAttribute('data-mobile')
        this.mobileView = false;
        this.onChanged()
    }
}
