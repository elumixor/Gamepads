import * as util from './util.js'

Object.defineProperty(Array.prototype, "sum", {
    value: function () {
        return this.reduce((a, b) => a + b, 0)
    },
    writable: false
});

Object.defineProperty(Array.prototype, "max", {
    value: function () {
        return this.reduce((a, b) => Math.max(a, b), -Infinity)
    },
    writable: false
});

Object.defineProperty(String.prototype, 'times', {
    value: function (count) {
        const suffix = count === 11 || count % 10 !== 1 ? 's' : ''
        return `${count} ${this}${suffix}`
    }
})


Object.defineProperty(Array.prototype, "min", {
    value: function () {
        return this.reduce((a, b) => Math.min(a, b), Infinity)
    },
    writable: false
});


Object.defineProperty(Object.prototype, 'iterate', {
    value: function (callback) {
        for (const n in this) {
            if (this.hasOwnProperty(n)) {
                callback(n, this[n])
            }
        }
    },
    writable: false
});

Object.defineProperty(Object.prototype, 'values', {
    get: function () {
        return Object.values(this)
    },
});

Object.defineProperty(Object.prototype, 'keys', {
    get: function () {
        return Object.keys(this)
    },
});

Object.defineProperty(Object.prototype, 'toArray', {
    get: function () {
        return Object.entries(this)
    }
});

Object.defineProperty(Object.prototype, 'length', {
    get: function () {
        return Object.entries(this).length
    }
});

Object.defineProperty(Node.prototype, 'appendNew', {
    value: function (tag, attributes) {
        const element = this.appendChild(document.createElement(tag))
        if (attributes)
            attributes.iterate((key, value) => element.setAttribute(key, value))
        return element
    }
});

Math.clamp = (a, min = 0, max = 1) => {
    return Math.min(max, Math.max(a, min))
}

Object.defineProperty(Node.prototype, 'removeChildren', {
    value: function () {
        while (this.firstChild) this.removeChild(this.lastChild);
    }
})


export function asyncHttp(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            reject(xhr.statusText);
        };
        xhr.send(null);
    });
}

export function walkDOM(node, callback) {
    callback(node);
    [...node.children].forEach(n => walkDOM(n, callback))
}

// const baseUrl = 'http://localhost:8080'

const baseUrl = 'http://192.168.0.31:8080'

export async function get(path) {
    return await asyncHttp(`${baseUrl}/${path}`)
}

export async function buildDom(filePath) {
    const xmlString = await util.get(filePath)
    const doc = new DOMParser().parseFromString(xmlString, "text/xml")
    const element = doc.firstChild
    const ids = {}

    walkDOM(element, node => {
        if (node.hasAttribute("id"))
            ids[node.id] = node
    })

    return {element, ids}
}
