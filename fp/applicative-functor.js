// Array applicative functor

let ApplicativeArray = {
    of: (...args) => args,
    // fmap :: (a -> b) -> Array a -> Array b
    fmap: (fn, array) => {
        return array.map(a => fn(a))
    },
    // apply :: Array(a -> b) -> Array a -> Array b
    apply: (arrA, arrB) => {
        return arrA
            .map(fnValueA => ApplicativeArray.fmap(fnValueA, arrB))
            .reduce((acc, arr) => [...acc,...arr], []); // to flatten we reduce it
    }
};

let arrayOne = ApplicativeArray.of(1,4);
let arrayTwo = ApplicativeArray.of(3,4,5);

let addTenArrayOne = ApplicativeArray.fmap(a => b => a + b + 10, arrayOne);
let applyAddToArrayTwo = ApplicativeArray.apply(addTenArrayOne, arrayTwo);

console.log(applyAddToArrayTwo);