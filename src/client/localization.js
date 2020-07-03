import {E} from './elements.js'

// export const supported = ['en', 'ru', 'cz']
export const supported = []


export function select(language) {
    const languageElements = document.querySelectorAll('[data-language]')
    for (const l of languageElements) {
        if (l.getAttribute('data-language') === language)
            l.style.backgroundColor = 'black'
        else
            l.style.backgroundColor = 'rgba(0,0,0,0.5)'
    }
}

const euro = '\u20AC'
const dollar = '\x24'

let currency = euro

export function getPrice(price) {
    price = Math.round(price * 100) / 100  // Round to two decimal places
    if (price <= 0) return 'Free'
    return `${currency} ${price}`
}
