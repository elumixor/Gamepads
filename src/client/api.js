import * as util from './util.js'

export let products
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

    for (const productName in products) {
        if (!products.hasOwnProperty(productName)) continue

        const product = products[productName]
        product.name = productName

        // fetch bounds data and place it into the object
        const bounds = product.bounds

        bounds.__front = JSON.parse(await util.get(bounds.front))
        bounds.__back = JSON.parse(await util.get(bounds.back))

        delete bounds.front
        delete bounds.back

        for (const n in bounds.__front) {
            if (!bounds.__front.hasOwnProperty(n)) continue

            bounds[n] = {front: bounds.__front[n], back: bounds.__back[n]}
        }

        for (const n in bounds.__back) {
            if (!bounds.__back.hasOwnProperty(n)) continue

            if (!bounds[n]) bounds[n] = {front: undefined}
            bounds[n].back = bounds.__back[n]
        }

        delete bounds.__front
        delete bounds.__back

        for (const n in bounds) {
            if (!bounds.hasOwnProperty(n)) continue

            if (!product.parts.hasOwnProperty(n)) delete bounds[n]
            else product.parts[n].bounds = bounds[n]
        }

        for (const partName in product.parts) {
            if (!product.parts.hasOwnProperty(partName)) continue

            const part = product.parts[partName]
            part.name = partName
            calculateBoundProperties(part.bounds)
        }
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

    calcProp(bounds.front)
    calcProp(bounds.back)
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
