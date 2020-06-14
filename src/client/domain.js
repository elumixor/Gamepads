import './util.js'

class Product {
    constructor(name, parts, icon) {
        this.name = name
        this.parts = parts
        this.icon = icon
    }

    getClickedPart(point) {
        return Object.values(this.parts)
            .filter(p => p.bounds.contain(point))
            .sort((a, b) => a.z() < b.z() ? -1 : 1)[0]
    }
}

class Bounds {
    z() {
        // todo
    }

    center() {
        // todo
    }

    radius() {
        // todo
    }

    contain(point) {
        // todo
    }
}

class Part {
    constructor(name, options, icon, bounds) {
        this.name = name
        this.options = options
        this.icon = icon
        this.bounds = bounds

        this.groupedOptions = {}

        this.options.forEach(o => {
            if (!(o.category in this.groupedOptions))
                this.groupedOptions[o.category] = {}

            let category = this.groupedOptions[o.category];

            if (!(o.price in category))
                category[o.price] = []

            category[o.price].push(o)
        })
    }
}

class Option {
    constructor(name, option) {
        this.name = name
        this.price = option.price
        this.icon = option.icon
        this.front = option.front
        this.back = option.back
        this.category = option.category
        this.boundsFront = option.boundsFront
        this.boundsBack = option.boundsBack
    }
}

class Configuration {
    constructor(product, partOptions) {
        this.product = product
        this.partOptions = partOptions
    }

    price() {
        return Object.values(this.partOptions).map(o => o.price).sum()
    }

    copy() {
        const partOptions = {}
        Object.entries(this.partOptions).forEach(([partName, option]) => partOptions[partName] = option)
        return new Configuration(this.product, partOptions)
    }
}

class Cart {
    constructor(configurations) {
        this.configurations = configurations
    }

    indexOf(configuration) {
        return this.configurations.indexOf(configuration)
    }

    price() {
        return this.configurations.map(c => c.price()).sum()
    }
}

export {Product, Part, Option, Configuration, Cart};
