import * as api from './api.js'
import {walkDOM} from "./util.js"
import {Configurator} from "./configurator.js"

const dom = {}

walkDOM(document.body, function (node) {
    if (node.hasAttribute("id"))
        dom[node.id] = node
})

const configurator = new Configurator(dom['configurator'])


;(async function initialize() {
    await api.initialize()

    // load configurator with xbox, new configuration
    configurator.loadConfiguration(api.newConfiguration(Object.keys(api.data)[0]))


    // for each product, create configurator elements

})()
