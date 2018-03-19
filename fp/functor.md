# Functor
*ALERT: I'm not shure that it is 100% correct description :)*
*tl;dr - functor is that you can map().*

So, what is functor?  

* Functor is fmap(transformationFn){...} function. Functors map functions of one type to another.
* fmap - function, that applies transformationFn to context's value.  
* Context (container) - 'surrounding object'. I.e. minimal context is object with 'value' property.

__Functor is any data type if it "knows how to fmap()".__  
 ```javascript
 // fmap :: (A -> B) -> Context(A) -> Context(B)
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

    // This function is prepared fmap() specially for this particular context
    map(transformationFn) {
        transformationFn = transformationFn.bind(null, this.value);
        return fmap(transformationFn)(Context);
    }
}
```
 Actually, we can call ```Context``` as functor becuse it knows how to fmap()!  
 What does functor do?  
 1. Unpacks value from context  
 2. Applies transformationFn to context's value  
 3. Wraps result to new context (of the same type) 

__Functor laws ([wiki.haskell.org](https://en.wikibooks.org/wiki/Haskell/The_Functor_class)):__  
1.When performing the mapping operation, if the values in the functor are mapped to 
themselves, the result will be an unmodified functor.  
*Or: fmap(v => v) ---> new context's value === previous context's value (as it was before fmap, no side-effects)*

2.If two sequential mapping operations are performed one after the other using two functions, the result 
should be the same as a single mapping operation with one function that is equivalent to applying the first
function to the result of the second.  
*Or: fmap(a(b('lol'))) === fmap(a(fmap(b('lol')))) - it is about function composition*
```javascript
const context = new Context('Hi there');
const transformed = context
        .map(v => v.toUpperCase())
        .map(v => v.concat('!'));
console.log(transformed); // Context { value: 'HI THERE!' }
```
 So, cool. But what's the deal? Where is the profit?  

 In 'Context' class there is no actual profit. But the context can be anything (and useful).
 Actually, it goes to monads usage where context (that is specific monad) gives you different
 perks like null-defensed code (Maybe/Either monads) and other stuff that should be covered further.
