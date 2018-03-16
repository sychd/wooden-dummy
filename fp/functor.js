// Code sample & text were taken from 'Functional Programming in JavaScript' by Luis Atencio, ch. 5

const R = require('ramda');

class Wrapper {
    constructor(value) {
        this._value = value;
    }
    // map :: (A -> B) -> A -> B
    map(f) {
        return f(this._value);
    };

    toString() {
        return 'Wrapper (' + this._value + ')';
    }
}
// wrap :: A -> Wrapper(A)
const wrap = (val) => new Wrapper(val);

const wrappedValue = wrap('Get Functional');
wrappedValue.map(R.identity); //-> 'Get Functional'

// fmap knows how to apply functions to values wrapped in a context. It first opens the
// container, then applies the given function to its value, and finally closes the value back
// into a new container of the same type. This type of function is known as a functor.

// fmap :: (A -> B) -> Wrapper[A] -> Wrapper[B]
Wrapper.prototype.fmap = function fmap(f) {
    const transformedValue = f(this._value);
    
    return new Wrapper(transformedValue);
};

const wrapped = wrap(1337);
console.log(wrapped.fmap(R.inc)); // Wrapper { _value: 1338 }
