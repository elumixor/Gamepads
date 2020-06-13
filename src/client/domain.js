import './util.js'

class Product {
    constructor(name, parts, icon) {
        this.name = name
        this.parts = parts
        this.icon = icon
    }
}

class Part {
    constructor(name, options, icon) {
        this.name = name
        this.options = options
        this.icon = icon
    }

    groupedOptions() {
        const groups = {}

        this.options.forEach(o => {
            if (!(o.category in groups))
                groups[o.category] = {}

            let category = groups[o.category];

            if (!(o.price in category))
                category[o.price] = []

            category[o.price].push(o)
        })

        return groups
    }
}

class Option {
    constructor(name, price, icon, front, back, category) {
        this.name = name
        this.price = price
        this.icon = icon
        this.front = front
        this.back = back
        this.category = category
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

    price() {
        return this.configurations.map(c => c.price()).sum()
    }
}

export {Product, Part, Option, Configuration, Cart};
