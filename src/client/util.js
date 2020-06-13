Object.defineProperty(Array.prototype, "sum", {
    value: function () {
        return this.reduce((a, b) => a + b, 0)
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
