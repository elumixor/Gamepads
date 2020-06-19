import {pointInPolygon} from "../../pointInPolygon.js"
import {Component} from "../component.js"

export class Configurator extends Component {
    constructor() {
        super();

        this.zoomedIn = false
        this.onUpdated = (configuration) => {
        }
    }

    connectedCallback() {
        // two panels
        this.containers = {
            front: this.appendNew('div'),
            back: this.appendNew('div')
        }

        this.bases = {
            front: this.containers.front.appendNew('img'),
            back: this.containers.back.appendNew('img')
        }

        this.selectedOptions = {
            front: this.containers.front.appendNew('div'),
            back: this.containers.back.appendNew('div')
        }

        this.modificationsText = this.appendNew('div')

        this.containers.front.addEventListener('click', e => this.click(e, 'front'))
        this.containers.back.addEventListener('click', e => this.click(e, 'back'))
    }

    click(e, side) {
        const t = e.target

        // relative x, y to our element
        let x = Math.clamp(e.offsetX / t.offsetWidth)
        let y = Math.clamp(e.offsetY / t.offsetHeight)

        // Get the clicked part, based on bounds polygons
        let clickedPart
        this.configuration.product.bounds.iterate((partName, bounds) => {
            if (clickedPart) return

            bounds = bounds[side]
            if (!bounds) return

            const point = [x, y]
            if (bounds.some(b => pointInPolygon(point, b)))
                clickedPart = [this.configuration.product.parts[partName], partName]
        })

        if (!clickedPart) return

        const front = clickedPart[0].bounds.front
        const back = clickedPart[0].bounds.back

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

        if (this.onPartSelected)
            this.onPartSelected(this.configuration, clickedPart)
    }

    zoomIn(center, radius) {
        this.zoomedIn = true
        this.modificationsText.hidden = true

        const documentWidth = document.body.offsetWidth
        const configuratorZoomedIn = 0.5
        const {x, y} = center

        // This should zoom into whole range?
        // const x = 0.5
        // const y = 0.5
        // radius = 1

        const width = configuratorZoomedIn * documentWidth / (2 * radius)
        this.style.width = width + "px"

        const height = this.offsetHeight
        const left = -x * width + configuratorZoomedIn * documentWidth / 2
        const top = -y * height + configuratorZoomedIn * documentWidth / 2
        this.style.left = left + "px"
        this.style.top = top + "px"
    }

    zoomOut() {
        this.zoomedIn = false
        this.modificationsText.hidden = false

        this.style.width = ''
        this.style.left = ''
        this.style.top = ''
    }

    update() {
        this.selectedOptions.front.removeChildren()
        this.selectedOptions.back.removeChildren()

        this.configuration.selectedOptions.iterate((partName, option) => {
            const {front, back} = option


            if (front)
                this.selectedOptions.front.appendNew('img', {src: option.front, alt: ''})
            if (back)
                this.selectedOptions.back.appendNew('img', {src: option.back, alt: ''})
        })

        this.updateText()
        this.onUpdated(this.configuration)
    }

    updateText() {
        const optionsCount = this.configuration.selectedOptions.length
        this.modificationsText.innerText = optionsCount === 0 ? 'Click on a part to modify' : 'modification'.times(optionsCount)
    }

    get configuration() {
        return this.config
    }

    set configuration(config) {
        if (this.config === config) return
        this.config = config

        // Load base images
        const {front, back} = config.product
        this.bases.front.src = front
        this.bases.back.src = back

        // update selected parts options
        this.update()
    }
}

window.customElements.define('app-configurator', Configurator)
