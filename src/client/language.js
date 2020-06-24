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
