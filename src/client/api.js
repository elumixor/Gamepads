import * as util from './util.js'

export let products
export let bounds
export const cart = [];

Object.defineProperty(cart, 'price', {
    get: function () {
        return cart.map(i => i.price * i.count).sum
    }
})

let _currentConfiguration

export function currentConfiguration() {
    return _currentConfiguration
}

export class Configuration {
    constructor(product) {
        this.product = product
        this.selectedOptions = {}
        product.parts.iterate((partName, part) => this.selectedOptions[partName] = part.options.first)
        this.count = 1
    }

    get price() {
        return this.product.price + this.selectedOptions.values.map(option => option.price).sum;
    }

    get modificationsCount() {
        const parts = this.product.parts
        return parts.keys
            .count(partName => this.selectedOptions[partName] !== parts[partName].options.first)
    }

    select() {
        currentConfiguration_(this)
        changeEvent.dispatch(_currentConfiguration)
    }

    selectOption(partName, option) {
        this.selectedOptions[partName] = option
        updateEvent.dispatch(_currentConfiguration)
    }
}


export function currentConfiguration_(newConf) {
    _currentConfiguration = newConf
}

export const updateEvent = new util.MyEvent()
export const changeEvent = new util.MyEvent()
export const dataLoadedEvent = new util.MyEvent()

// Whenever cart is changed, update is also called
changeEvent.subscribe(config => updateEvent.dispatch(config))

export async function fetchData() {
    products = JSON.parse(await util.get('products'))
    bounds = JSON.parse(await util.get('bounds'))

    for (const productName in products) {
        if (!products.hasOwnProperty(productName)) continue

        const product = products[productName]
        product.name = productName
    }

    for (const b in bounds) {
        for (const p in bounds[b].front) calculateBoundProperties(bounds[b].front[p])
        for (const p in bounds[b].back) calculateBoundProperties(bounds[b].back[p])
    }

    dataLoadedEvent.dispatch(products)

    new Configuration(products.first).select()

}

function calculateBoundProperties(bounds) {
    function max(a, b) {
        return a > b ? a : b
    }

    function calcProp(b) {
        if (b) {
            const x = b.map(bound => bound.map(point => point[0])).flat()
            const y = b.map(bound => bound.map(point => point[1])).flat()

            const xMax = x.max()
            const xMin = x.min()

            const yMax = y.max()
            const yMin = y.min()

            b.center = {x: (xMax + xMin) / 2, y: (yMax + yMin) / 2}
            b.radius = max((xMax - xMin) / 2, (yMax - yMin) / 2)
        }
    }

    calcProp(bounds)
}

function ordinal_suffix_of(i) {
    const j = i % 10,
        k = i % 100
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

function currentConfigLabel(productName) {
    const index = cart.indexOf(productName)
    if (index < 0) return "Not in cart"
    return (index + 1) + ordinal_suffix_of(index + 1) + " in cart"
}

export function saveToCart(configuration) {
    // check if editing, i.e., if this configuration is already in cart
    if (cart.indexOf(configuration) < 0)
        cart.push(configuration)


    new Configuration(products[configuration.product.name]).select()
}

export function sendOrder() {
    util.post('order', cart)
    cart.length = 0
}
