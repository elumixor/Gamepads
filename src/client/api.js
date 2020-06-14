import {Configuration, Option, Part, Product, Cart} from './domain.js'
import * as util from './util.js'


const products = {};
const defaultConfigurations = {};
const currentConfigurations = {};

const cart = new Cart();

async function initialize() {
    const data = JSON.parse(await util.asyncHttp("http://192.168.0.31:8080/products"))

    for (const productName in data) {
        if (!data.hasOwnProperty(productName)) continue

        const parts = []

        const dataParts = data[productName].parts
        for (const partName in dataParts) {
            if (!dataParts.hasOwnProperty(partName)) continue

            const dataPart = dataParts[partName]
            const dataOptions = dataPart.options
            const options = []

            for (const optionName in dataOptions) {
                if (!dataOptions.hasOwnProperty(optionName)) continue

                const dataOption = dataOptions[optionName]

                const option = new Option(optionName, dataOption)
                options.push(option)
            }

            const part = new Part(partName, options, dataPart.icon)
            parts.push(part)
        }

        let product = new Product(productName, parts, data[productName].icon)
        products[productName] = product

        const partOptions = {}
        product.parts.forEach(part => partOptions[part.name] = part.options[0])

        defaultConfigurations[productName] = new Configuration(product, partOptions)
        currentConfigurations[productName] = newConfiguration(productName)
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
    products, currentConfigurations, cart
}
