import {fold, Monoid} from "fp-ts/lib/Monoid";
import {either, Either, isLeft} from "fp-ts/lib/Either";

let monoidSum: Monoid<number> = {
    concat: (x, y) => x + y,
    empty: 0
};

let monoidProduct: Monoid<number> = {
    concat: (x, y) => x * y,
    empty: 1
};

//fold from lib
let mFold = <M>(monoid: Monoid<M>) => (xs: Array<M>) => {
    return xs.reduce(monoid.concat, monoid.empty);
}

//getApplyMonoid from lib
let mGetApplyMonoid = <E, R>(monoid: Monoid<R>):  (Monoid<Either<E, R>>) => {
    return {
        concat: (x, y) => isLeft(x) ? x : isLeft(y) ? y : either.of(monoid.concat(x.right, y.right)),
        empty: either.of(monoid.empty)
    }
};


let eitherValues: Array<Either<string, number>> = [either.of(4), either.of(5), either.of(6)];

let eitherMonoidSum: Monoid<Either<string, number>> = {
    concat: (x, y) => isLeft(x) ? x : isLeft(y) ? y : either.of(x.right + y.right),
    empty: either.of(0)
};

console.log(fold(monoidSum)([1, 2, 3]));
console.log(fold(eitherMonoidSum)(eitherValues));
console.log(mFold(mGetApplyMonoid(monoidProduct))(eitherValues));