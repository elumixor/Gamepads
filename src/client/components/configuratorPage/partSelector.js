import * as util from '../../util.js'
import {changeEvent, updateEvent, currentConfiguration as C} from '../../api.js'
import {pointInPolygon} from "../../pointInPolygon.js"
import {Component} from "../component.js"
import {Responsive} from "../responsive.js"
import {E} from '../../elements.js'
import * as api from '../../api.js'

export class PartSelector extends Responsive(Component) {
    constructor() {
        super();

        this.zoomedIn = false

        updateEvent.subscribe(() => this.dataLoadedCallback())
    }

    connectedCallback() {
        this.containers = {
            front: this.appendNew('div'),
            back: this.appendNew('div')
        }

        this.bases = {
            front: this.containers.front.appendNew('img'),
            back: this.containers.back.appendNew('img')
        }

        this.loadedImages = 0

        this.bases.front.addEventListener('load', () => this.calculateAspect())
        this.bases.back.addEventListener('load', () => this.calculateAspect())

        this.selectedOptions = {
            front: this.containers.front.appendNew('div'),
            back: this.containers.back.appendNew('div')
        }

        this.modificationsText = this.appendNew('div')

        this.containers.front.onclick = e => this.click(e, 'front')
        this.containers.back.onclick = e => this.click(e, 'back')
    }

    onMobile() {
        super.onMobile();
    }

    onDesktop() {
        super.onDesktop();
        this.zoomOut()
    }

    dataLoadedCallback() {
        this.configuration = C()

        // Load base images
        const {front, back} = this.configuration.product
        this.bases.front.src = front
        this.bases.back.src = back

        // update selected parts options
        this.selectedOptions.front.removeChildren()
        this.selectedOptions.back.removeChildren()

        this.configuration.selectedOptions.iterate((partName, option) => {
            const {front, back} = option

            if (front)
                this.selectedOptions.front.appendNew('img', {src: option.front, alt: ''})
            if (back)
                this.selectedOptions.back.appendNew('img', {src: option.back, alt: ''})
        })


        const modificationsCount = this.configuration.modificationsCount
        this.modificationsText.innerText =
            modificationsCount === 0 ? 'Click on a part to modify' : 'modification'.times(modificationsCount)
    }

    click(e, part) {
        const t = e.target

        let width, height, x, y
        if (t.offsetWidth / t.offsetHeight > this.aspect) { // too wide -> height ok, recalculate width
            height = t.offsetHeight
            y = e.offsetY / height


            width = height * this.aspect
            x = (e.offsetX - (t.offsetWidth - width) / 2) / width
        } else { // too narrow -> width ok, recalculate height
            width = t.offsetWidth
            x = e.offsetX / width

            height = width / this.aspect
            y = (e.offsetY - (t.offsetHeight - height) / 2) / height
        }

        // Restrict to actual image
        if (x < 0 || x > 1 || y < 0 || y > 1) return

        // Get the clicked part, based on bounds polygons
        let clickedPart
        const bounds = api.bounds[this.configuration.product.name]

        if (part === 'front') {
            bounds.front.iterate((partName, bounds) => {
                if (clickedPart) return

                if (!bounds) return

                const point = [x, y]
                if (bounds.some(b => pointInPolygon(point, b))) {
                    clickedPart = partName
                }
            })
        } else bounds.back.iterate((partName, bounds) => {
            if (clickedPart) return

            if (!bounds) return

            const point = [x, y]
            if (bounds.some(b => pointInPolygon(point, b))) {
                clickedPart = partName
            }
        })

        if (!clickedPart || !this.configuration.product.parts[clickedPart]) return

        if (this.mobileView) {
            const front = bounds.front[clickedPart]
            const back = bounds.back[clickedPart]

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
        }

        this.onPartSelected(this.configuration.product.parts[clickedPart])
    }

    onPartSelected(part) {
        E['main-page'].hidden = true
        E['cart-icon'].hidden = true
        E['order-button'].hidden = this.mobileView
        E['editor'].setAttribute('data-open', '')
        E['editor'].selectPart(part)
    }

    zoomIn(center, radius) {
        this.zoomedIn = true
        this.modificationsText.hidden = true

        let width = 50 // we want the half of the page to be occupied with our image
        let height = 50 / this.aspect // height for one image
        height *= 2 // two images stacked without spacing

        width /= 2 * radius
        height /= 2 * radius

        const offsetX = -width * center.x + 25
        const offsetY = -height * center.y + 25

        this.style.width = `${width}vw`
        this.style.height = `${height}vw` // 2 images, stacked vertically without spacing
        this.style.left = `${offsetX}vw`
        this.style.top = `${offsetY}vw`

        this.setAttribute('zoomed', '')
    }

    zoomOut() {
        this.zoomedIn = false
        this.modificationsText.hidden = false

        this.style.width = ''
        this.style.left = ''
        this.style.top = ''
        this.style.height = ''

        this.removeAttribute('zoomed')

        E['main-page'].hidden = false
        E['cart-icon'].hidden = false
        E['order-button'].hidden = false
        E['editor'].removeAttribute('data-open')
    }

    calculateAspect() {
        this.loadedImages++
        if (this.loadedImages !== 2) return

        // assume back image has the same size as the front (for now)
        const imageWidth = this.bases.front.naturalWidth
        const imageHeight = this.bases.front.naturalHeight

        this.aspect = imageWidth / imageHeight
    }
}
