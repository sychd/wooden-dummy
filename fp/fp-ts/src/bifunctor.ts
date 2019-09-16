//http://hackage.haskell.org/package/base-4.12.0.0/docs/Data-Bifunctor.html
//Intuitively it is a bifunctor where both the first and second arguments are covariant.

import {Either, either, left} from "fp-ts/lib/Either";

let rightValue: Either<string, string> = either.of("Right value");
let leftValue = left("Left value");
let markMapped = (v: string) => v.concat(" mapped");

let rightMapped = either.bimap(rightValue, markMapped, markMapped);
let leftMapped = either.bimap(leftValue, markMapped, markMapped);

console.log(rightMapped, leftMapped);
