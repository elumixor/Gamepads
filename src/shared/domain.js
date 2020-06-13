import '../shared/util.js'

class Product {
    constructor(name, parts) {
        this.name = name
        this.parts = parts
    }
}

class Part {
    constructor(name, options) {
        this.name = name
        this.options = options
    }

    price() {
        return this.options.map(o => o.price).reduce((a, b) => a + b, 0)
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
    constructor(name, price, icon, image, category) {
        this.name = name
        this.price = price
        this.icon = icon
        this.image = image
        this.category = category
    }
}

class Configuration {
    constructor(product, partOptions) {
        this.product = product
        this.partOptions = partOptions
    }

    price() {
        return this.partOptions.map(po => po.option.price).reduce((a, b) => a + b, 0)
    }
}

class Cart {
    constructor(configurations) {
        this.configurations = configurations
    }

    price() {
        return this.configurations.map(c => c.price()).reduce((a, b) => a + b, 0)
    }
}
