
// allow accessing class names, may cause errors in ES5...
interface Function {
    name: string;
}

// polyfills
interface Array<T> {
    find(predicate: (search: T) => boolean) : T;
    sum(): T;
    max(): T;
    min(): T;
    rand(): T;
    popRand(): T;
}

if (!Array.prototype.popRand) {
    // remove and return a random element
    Array.prototype.popRand = function() {
        let idx = Math.floor(Math.random() * this.length);
        return this.splice(idx, 1);
    }
}

if (!Array.prototype.rand) {
    Array.prototype.rand = function() {
        if (this.length) return this[Math.floor(Math.random() * this.length)];
        return null;
    }
}

if (!Array.prototype.sum) {
    Array.prototype.sum = function() {
        return this.reduce((a,b) => a+b, 0);
    }
}

if (!Array.prototype.max) {
    Array.prototype.max = function() {
        if (this.length == 0) return null;
        let ret = this[0];
        for (let x of this) if (x > ret) ret = x;
        return ret;
    }
}

if (!Array.prototype.min) {
    Array.prototype.min = function() {
        if (this.length == 0) return null;
        let ret = this[0];
        for (let x of this) if (x < ret) ret = x;
        return ret;
    }
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
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


function GetSubClasses(type: any, ignoreExtendedClasses: boolean): (typeof Object)[] {
    let allSubclasses = Object.keys(window).map(prop => <typeof Object>window[prop]).filter(o => o && o.prototype && o.prototype instanceof type);
    if (ignoreExtendedClasses) {
        allSubclasses = allSubclasses.filter(c => !HasSubClasses(c));
    }
    return allSubclasses
}
function HasSubClasses(type: any) {
    return Object.keys(window).map(prop => <typeof Object>window[prop]).filter(o => o && o.prototype && o.prototype instanceof type).length > 0;
}




function RandBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}


function WeightedAvg(a: number, b: number, weightToB: number) {
    return a * (1 - weightToB) + b * weightToB;
}



// How is this not built-in functionality?
// https://stackoverflow.com/questions/1007981
function GetFuncArgs(func): string[] {  
    return (func + '')
      .replace(/[/][/].*$/mg,'') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
      .replace(/=[^,]+/g, '') // strip any ES6 defaults  
      .split(',').filter(Boolean); // split & filter [""]
}  


function Create(objectName: string, args: any[]): Object {
    return new window[objectName](...args)
}


function NumRange(start: number, end: number = start, step: number = 1): number[] {
    if (start === end) start = 0;
    if (step <= 0) throw "Invalid step: " + step;
    let ret = [];
    for (let i=start; i < end; i += step) ret.push(i);
    return ret;
}

function Nums(value: number, count: number): number[] {
    // shorthand for array of all one number 
    return (<any>Array).from(new Array(count), (x,i) => value)
}