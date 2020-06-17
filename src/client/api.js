import {Configuration, Option, Part, Product, Cart} from './domain.js'
import * as util from './util.js'


const products = {};
const defaultConfigurations = {};
const currentConfigurations = {};
let data;
const cart = new Cart();

const baseUrl = 'http://192.168.0.31:8080'

async function initialize() {
    data = JSON.parse(await util.asyncHttp(`${baseUrl}/products`))

    for (const productName in data) {
        if (!data.hasOwnProperty(productName)) continue

        // fetch bounds data and place it into the object
        const bounds = data[productName].bounds

        bounds.__front = JSON.parse(await util.asyncHttp(`${baseUrl}${bounds.front.slice(1)}`))
        bounds.__back = JSON.parse(await util.asyncHttp(`${baseUrl}${bounds.back.slice(1)}`))

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

            if (!data[productName].parts.hasOwnProperty(n)) delete bounds[n]
            else data[productName].parts[n].bounds = bounds[n]
        }

        const selectedOptions = {}
        for (const partName in data[productName].parts) {
            if (!data[productName].parts.hasOwnProperty(partName)) continue

            const options = data[productName].parts[partName].options
            selectedOptions[partName] = options[Object.keys(options)[0]]
        }

        const config = defaultConfigurations[productName] = {product: data[productName], selectedOptions}
        config.copy = () => {
            return {product: config.product, selectedOptions: {...config.selectedOptions}}
        }
    }
}

function newConfiguration(productName) {
    return defaultConfigurations[productName].copy()
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

function configCartIndex(productName) {
    return cart.indexOf(currentConfigurations[productName])
}

function currentConfigLabel(productName) {
    const index = configCartIndex(productName)
    if (index < 0) return "Not in cart"
    return (index + 1) + ordinal_suffix_of(index + 1) + " in cart"
}

function saveInCart(productName) {
    const configuration = currentConfigurations[productName]
    // check if editing, i.e., if this configuration is already in cart
    if (configCartIndex(productName) < 0)
        cart.push(configuration)

    currentConfigurations[productName] = newConfiguration(productName)
}

function editConfiguration(configuration) {
    currentConfigurations[configuration.product.name] = configuration
}

function duplicateConfiguration(configuration) {
    cart.push(configuration.copy())
}

export {
    initialize, newConfiguration, currentConfigLabel, configCartIndex, saveInCart, editConfiguration,
    duplicateConfiguration,
    data, products, currentConfigurations, cart
}
