import * as util from './util.js'

Object.defineProperty(Array.prototype, 'remove', {
    value: function (item) {
        const index = this.indexOf(item)
        if (index < 0) return

        for (let i = index; i < this.length - 1; ++i) {
            this[i] = this[i + 1]
        }

        --this.length
    }
})

Object.defineProperty(Array.prototype, "sum", {
    get: function () {
        return this.reduce((a, b) => a + b, 0)
    }
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

Object.defineProperty(Object.prototype, 'keyOf', {
    value: function (v) {
        for (const k in this) {
            if (this.hasOwnProperty(k) && this[k] === v) return k
        }
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

Object.defineProperty(Object.prototype, 'first', {
    get: function () {
        return this.values[0]
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


export function walkDOM(node, callback) {
    callback(node);
    [...node.children].forEach(n => walkDOM(n, callback))
}

// const baseUrl = 'http://localhost:8080'
// const baseUrl = 'http://192.168.0.31:8080' // win
const baseUrl = 'http://192.168.0.94:8080' // mac

export async function get(path) {
    return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${baseUrl}/${path}`, true);

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
    })
}

export async function post(path, data) {
    return await new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${baseUrl}/${path}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        xhr.send(JSON.stringify(data));

        xhr.onloadend = function () {
            resolve()
        };
    })
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

let _isMobile

addEventListener('load', () => {
    _isMobile = innerWidth < 500
    dispatchEvent(new CustomEvent('deviceChanged', {detail: _isMobile}))
})

addEventListener('resize', () => {
    const newMobile = innerWidth < 500

    if (newMobile && !_isMobile) dispatchEvent(new CustomEvent('deviceChanged', {detail: newMobile}))
    else if (!newMobile && _isMobile) dispatchEvent(new CustomEvent('deviceChanged', {detail: newMobile}))

    _isMobile = newMobile
})

export function isMobile() {
    return _isMobile;
}

export function responsiveElement(onMobileCallback, onDeviceCallback) {
    addEventListener('deviceChanged', ({detail: isMobile}) => {
        if (isMobile) onMobileCallback()
        else onDeviceCallback()
    })
}
