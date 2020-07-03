import {E} from './elements.js'

let reference
let c
const fz = 10

function checkReference() {
    if (!reference) {
        reference = E['font-sizer']
    }

}

export function dynamicTextSize(el, minimum = 0, maximum = 40, multiplier = 1) {
    checkReference()
    reference.innerText = el.innerText
    console.log(el.innerText)

    const w = reference.clientWidth
    const h = reference.clientHeight

    const computedStyle = getComputedStyle(el);

    const elw = el.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)
    const elh = el.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom)

    const size_w = elw * fz / w
    const size_h = elh * fz / h

    el.style.fontSize = `${Math.clamp(Math.min(size_w, size_h) * multiplier, minimum, maximum)}px`
}
