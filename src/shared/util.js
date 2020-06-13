Object.defineProperty(Array.prototype, "sum", {
    value: function() {
        return this.reduce((a, b) => a + b, 0)
    },
    writable: false
});
