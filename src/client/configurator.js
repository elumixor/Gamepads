import * as api from "./api.js"
import {pointInPolygon} from "./pointInPolygon.js"

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

        this.front.addEventListener('click', e => {
            const x = e.offsetX / e.target.offsetWidth
            const y = e.offsetY / e.target.offsetHeight

            this.onPartClicked(x, y, 'front')
        })

        this.back.addEventListener('click', e => {
            const x = e.offsetX / e.target.offsetWidth
            const y = e.offsetY / e.target.offsetHeight

            this.onPartClicked(x, y, 'back')
        })
    }

    onPartClicked(x, y, part) {
        let clickedPart

        console.log(this.configuration)
        this.configuration.product.bounds.iterate((partName, bounds) => {
            if (clickedPart) return

            bounds = bounds[part]
            if (!bounds) return

            const point = [x, y]
            if (bounds.some(b => pointInPolygon(point, b)))
                clickedPart = this.configuration.product.parts[partName]
        })

        if (clickedPart) {
            let front = clickedPart.bounds.front
            let back = clickedPart.bounds.back

            if (front && back) {
                const xMin = Math.min(front.center.x - front.radius, back.center.x - back.radius)
                const xMax = Math.max(front.center.x + front.radius, back.center.x + back.radius)
                const centerX = (xMin + xMax) / 2

                const yMin = (front.center.y - front.radius) / 2
                const yMax = (1 + back.center.y + front.radius) / 2
                const centerY = (yMin + yMax) / 2

                this.zoomIn({x: centerX, y: centerY}, Math.max((xMax - xMin) / 2, (yMax - yMin) / 2))
            } else if (front) {
                const {x, y} = front.center
                this.zoomIn({x, y: y / 2}, front.radius)
            } else {
                const {x, y} = back.center
                this.zoomIn({x, y: (1 + y) / 2}, back.radius)
            }
        } else {
            // todo: clicked body? or do nothing
            // do nothing. add body bound later + better bounds (somehow, plz not by hand...)
        }
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
