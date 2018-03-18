// Code sample & text were taken from 'Functional Programming in JavaScript' by Luis Atencio, ch. 5
//
// -Type constructor—Creates monadic types (similar to the Wrapper constructor).
// -Unit function—Inserts a value of a certain type into a monadic structure (similar
// to the wrap and empty functions you saw earlier). When implemented in the
// monad, though, this function is called of .
// -Bind function—Chains operations together (this is a functor’s fmap , also known as
// flatMap ). From here on, I’ll use the name map , for short. By the way, this bind
// function has nothing to do with the function-binding concept of chapter 4.
// -Join operation—Flattens layers of monadic structures into one. This is especially
// important when you’re composing multiple monad-returning functions.

class Wrapper {
    // Type constructor
    constructor(value) {
        this._value = value;
    }

    // Unit function
    static of(a) {
        return new Wrapper(a);
    }
    // Bind function (the functor)
    map(f) {
        return Wrapper.of(f(this._value));
    }
    // Flattens nested layers
    join() {
        if (!(this._value instanceof Wrapper)) {
            return this;
        }
        return this._value.join();
    }
    // Returns a textual representation of this structure
    toString() {
        return `Wrapper (${this._value})`;
    }
}

const R = require('ramda');
// cant't say what the benefit is here, but just let it be here
const hi = Wrapper.of('Hello')
    .map(v => {
        return Wrapper.of(R.concat(v, ' monads'));
    })
    .map(v => {
        return Wrapper.of(v.map(R.concat(R.__, '!')))
    });

console.log(hi); // Wrapper { _value: Wrapper { _value: Wrapper { _value: 'hello monads!' } } }
console.log(hi.join()); //Wrapper { _value: 'hello monads!' } - flattens the structure
