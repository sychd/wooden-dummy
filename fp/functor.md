*ALERT: I'm not shure that it is 100% correct description :)*
# Functor?
*tl;dr - Functor is that you can map().*

So, what is functor?
Functor = fmap(mapFn) + context
fmap - function, that applies mapFn to context's value.
Context - 'surrounding object'. I.e. minimal context is object with 'value' property.
Actually, Context is a Functor (sorry for confusing, but nothing can do).
__Functor is any data type if it "knows how to fmap()".__
 ```javascript
class Context {
    constructor(value) {
        this.value = value;
    }

    fmap(mapFn) {
        const transformedValue = mapFn(this.value);

        return new Context(transformedValue);
    }
}
```

 What does functor do?
 1. Unpacks value from context -> 
 2. Applies mapFn to context's value -> 
 3. Wraps result to new context (of the same type)

__Functor laws ([wiki.haskell.org](https://en.wikibooks.org/wiki/Haskell/The_Functor_class)):__
1.When performing the mapping operation, if the values in the functor are mapped to 
themselves, the result will be an unmodified functor.
*Or: fmap(v => v) ---> new context's value === previous context's value (as it was before fmap)*

2.If two sequential mapping operations are performed one after the other using two functions, the result 
should be the same as a single mapping operation with one function that is equivalent to applying the first
function to the result of the second.
*Or: fmap(a(b('lol'))) === fmap(a(fmap(b('lol')))) - it is like function composition*
```javascript
const functor = new Context('Hi there');
const transformed = functor
        .fmap(v => v.toUpperCase())
        .fmap(v => v.concat('!'));
        
console.log(transformed); // Context { value: 'HI THERE!' }
```
 So, cool. But what's the deal? Where is the profit?
 In 'Context' class there is no actual profit. The context can be anything (and useful).
 Actually, it goes to monads usage where context (=== specific monad) gives you different
 perks like null-proof code (Maybe/Either monads) and other stuff that should be covered futrher.
