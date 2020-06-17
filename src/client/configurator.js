import * as api from "./api.js"

const documentWidth = document.body.offsetWidth
const configuratorZoomedOut = 0.8 // a
const configuratorZoomedIn = 0.5 // d

export class Configurator {
    constructor(element, product) {
        this.configuration = null
        this.element = element

        this.front = document.createElement('div')
        this.back = document.createElement('div')

        this.frontParts = {base: document.createElement('img')}
        this.backParts = {base: document.createElement('img')}

        this.frontParts.base.src = product.front
        this.backParts.base.src = product.back

        this.front.appendChild(this.frontParts.base)
        this.back.appendChild(this.backParts.base)

        product.parts.iterate(partName => {
            const partElement = this.frontParts[partName] = document.createElement('img')
            this.front.appendChild(partElement)
        })


        this.modifications = document.createElement('div')

        this.element.appendChild(this.front)
        this.element.appendChild(this.back)
        this.element.appendChild(this.modifications)

        element.addEventListener('click', e => {
            // Get part from point
            // zoom from data from that part

            // We need to have

            // Get current part where clicked
            // Get what has been clicked
            // (Circle (Point x, y), radius)
            const x = (e.clientX - e.target.offsetLeft) / e.target.offsetWidth
            const y = (e.clientY - e.target.offsetTop) / e.target.offsetHeight

            // const clickedPart = this.configuration.product.getClickedPart({x, y})
            // this.zoomIn(clickedPart.bounds.center(), clickedPart.bounds.radius())

            const radius = .1
            // this.zoomIn({x, y}, radius)

            console.log(`clicked at ${x} ${y}`)
            const partOptions = this.configuration.partOptions
            Object.keys(partOptions).forEach(partName => console.log(api.data[this.configuration.product.name]))
        })
    }

    zoomIn(center, radius) {
        const {x, y} = center

        const width = configuratorZoomedIn * documentWidth / (2 * radius)
        this.element.style.width = width + "px"

        const height = this.element.offsetHeight
        const left = -x * width + configuratorZoomedIn * documentWidth / 2
        const top = -y * height + configuratorZoomedIn * documentWidth / 2
        this.element.style.left = left + "px"
        this.element.style.top = top + "px"
    }

    loadConfiguration(configuration) {
        this.configuration = configuration
        const product = configuration.product

        // load base images
        this.front.src = product.front
        this.back.src = product.back


        // load images of parts
        configuration.selectedOptions.iterate((part, option) => {
            console.log(option)
            this.frontParts[part].src = option.front
        })
    }
}


function loadConfiguration(configuration) {
    // init base
    // init parts?
    const product = api.data[configuration.product.name]

    this.front.base.image = product.front;
    this.back.base.image = product.back;

    // front.bounds = ...
    // back.bounds = ...

    // front.parts = ...
    // front.parts = ...


    // const logo = dom['logo']
    // const margin = logo.offsetTop
    // let top = 2 * margin + logo.offsetHeight
    //
    // front.style.top = top + "px"
    //
    // top += front.offsetHeight + 2 * margin
    //
    // back.style.top = top + "px"
    //
    // top += back.offsetHeight + margin
    //
    // const modificationCount = dom['modification-count']
    // modificationCount.style.top = top + "px"
}


// function initConfigurators(/*) {
//     console.log(api.data)
//     for (const productName in api.data) {
//         if (!api.data.hasOwnProperty(productName)) continue
//
//         configuratorElements[productName] = new ConfiguratorElement(dom[], api.newConfiguration('xbox'))
//
//
//     }
//
//
// }*/