import * as api from './api.js'
import {walkDOM} from "./util.js"
import {Configurator} from "./configurator.js"

const dom = {}

walkDOM(document.body, function (node) {
    if (node.hasAttribute("id"))
        dom[node.id] = node
})



;(async function initialize() {
    await api.initialize()

    const configurator = new Configurator(dom['configurator'], api.data['xbox'])

    // load configurator with xbox, new configuration
    configurator.loadConfiguration(api.newConfiguration(Object.keys(api.data)[0]))


    // for each product, create configurator elements

})()
