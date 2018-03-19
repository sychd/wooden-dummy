const R = require('ramda');
function fmap(transformValueFn) {
    return function (Ctx) {
        return Ctx.of(transformValueFn());
    }
}

class Context { 
    constructor(value) {
        this.value = value;
    }

    // Just creates new Context instance
    static of(value) { 
        return new Context(value);
    }

    // This function is prepared fmap() directly for this context
    map(transformationFn) {
        transformationFn = transformationFn.bind(null, this.value);
        return fmap(transformationFn)(Context);
    }
}

const context = new Context('Hi there');
const transformed = context
        .map(v => v.toUpperCase())
        .map(v => v.concat('!'));
console.log(transformed); // Context { value: 'HI THERE!' }