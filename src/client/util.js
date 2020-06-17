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

// function returns a Promise
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
