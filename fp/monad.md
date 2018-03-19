# Monad
*ALERT: I'm not shure that it is 100% correct description :)*
*tl;dr - Monad is functor on steroids (with extra features).*

>A monad exists when you create a whole data type around this idea of lifting values
>inside containers and defining the rules of containment.

>Monad—Provides the abstract interface for monadic operations  
>Monadic type—A particular concrete implementation of this interface

>* Type constructor—Creates monadic types (similar to the Wrapper constructor).
>* Unit function—Inserts a value of a certain type into a monadic structure (similar
>to the wrap and empty functions you saw earlier). When implemented in the
>monad, though, this function is called of .
>* Bind function—Chains operations together (this is a functor’s fmap , also known as
>flatMap ). From here on, I’ll use the name map , for short. By the way, this bind
>function has nothing to do with the function-binding concept of chapter 4.
>* Join operation—Flattens layers of monadic structures into one. This is especially
>important when you’re composing multiple monad-returning functions.  

```javascript
class Wrapper {
    //  Type constructor
    constructor(value) {
        this._value = value;
    }

    // Unit function
    static of(a) {
        return new Wrapper(a);
    }

    // Bind function (the functor)
    map(f) {
        return Wrapper.of(f(this.value));
    }

    // Flattens nested layers
    join() {
        if (!(this.value instanceof Wrapper)) {
            return this;
        }
        return this.value.join();
    }
    toString() {
        return `Wrapper (${this.value})`;
    }
}
```

Taken from book *"Functional Programming in JavaScript" by Luis Atencio, chapter 5*
---------------------------------------------------------------------
I've liked this chapter a lot and advise you to look through. At the moment I can't describe
better so here is copypaste of a small part of the mentioned source. 



