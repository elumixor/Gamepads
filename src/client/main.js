import * as api from './api.js'


(async function initialize() {
    await api.initialize()
    initConfigurators()
    console.log(api.newConfiguration('xbox'))

})()

function onButtonClicked() {
    console.log("Button Clicked")
    console.log([1, 2, 3].sum())
}

const documentWidth = document.body.offsetWidth
const configuratorZoomedOut = 0.8 // a
const configuratorZoomedIn = 0.5 // d

class ConfiguratorElement {
    constructor(element, configuration) {
        this.configuration = configuration
        this.element = element
        this.element.style.position = "absolute"
        this.parts = this.configuration.product.parts


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
            this.zoomIn({x, y}, radius)
        })

        this.zoomOut()
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

    zoomOut() {
        const margin = (1 - configuratorZoomedOut) / 2 * documentWidth

        this.element.style.left = margin + "px"
        this.element.style.top = margin + "px"
        this.element.style.width = configuratorZoomedOut * documentWidth + "px"
    }
}

function initConfigurators() {
    const elements = [...document.querySelectorAll("[data-configurator]")]
        .map(element => new ConfiguratorElement(element, api.newConfiguration('xbox')))
}
