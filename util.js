if (!Array.prototype.popRand) {
    // remove and return a random element
    Array.prototype.popRand = function () {
        var idx = Math.floor(Math.random() * this.length);
        return this.splice(idx, 1);
    };
}
if (!Array.prototype.rand) {
    Array.prototype.rand = function () {
        if (this.length)
            return this[Math.floor(Math.random() * this.length)];
        return null;
    };
}
if (!Array.prototype.sum) {
    Array.prototype.sum = function () {
        return this.reduce(function (a, b) { return a + b; }, 0);
    };
}
if (!Array.prototype.max) {
    Array.prototype.max = function () {
        if (this.length == 0)
            return null;
        var ret = this[0];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x > ret)
                ret = x;
        }
        return ret;
    };
}
if (!Array.prototype.min) {
    Array.prototype.min = function () {
        if (this.length == 0)
            return null;
        var ret = this[0];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x < ret)
                ret = x;
        }
        return ret;
    };
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
function GetSubClasses(type, ignoreExtendedClasses) {
    var allSubclasses = Object.keys(window).map(function (prop) { return window[prop]; }).filter(function (o) { return o && o.prototype && o.prototype instanceof type; });
    if (ignoreExtendedClasses) {
        allSubclasses = allSubclasses.filter(function (c) { return !HasSubClasses(c); });
    }
    return allSubclasses;
}
function HasSubClasses(type) {
    return Object.keys(window).map(function (prop) { return window[prop]; }).filter(function (o) { return o && o.prototype && o.prototype instanceof type; }).length > 0;
}
function RandBetween(min, max) {
    return Math.random() * (max - min) + min;
}
function WeightedAvg(a, b, weightToB) {
    return a * (1 - weightToB) + b * weightToB;
}
// How is this not built-in functionality?
// https://stackoverflow.com/questions/1007981
function GetFuncArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
        .replace(/=[^,]+/g, '') // strip any ES6 defaults  
        .split(',').filter(Boolean); // split & filter [""]
}
function Create(objectName, args) {
    return new ((_a = window[objectName]).bind.apply(_a, [void 0].concat(args)))();
    var _a;
}
function NumRange(start, end, step) {
    if (end === void 0) { end = start; }
    if (step === void 0) { step = 1; }
    if (start === end)
        start = 0;
    if (step <= 0)
        throw "Invalid step: " + step;
    var ret = [];
    for (var i = start; i < end; i += step)
        ret.push(i);
    return ret;
}
function Nums(value, count) {
    // shorthand for array of all one number 
    return Array.from(new Array(count), function (x, i) { return value; });
}
//# sourceMappingURL=util.js.map