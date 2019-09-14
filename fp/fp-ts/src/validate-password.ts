// with look at https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
// btw, here is getValidation already in fp-ts
import {chain, either, Either, isLeft, left, mapLeft, Right, right} from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import {IO} from "fp-ts/lib/IO";
import {Monoid} from "fp-ts/lib/Monoid";

const SHORT = "Password should be more than 5";
const NO_CAPITAL = "Password should contain at least 1 capital letter";
const length = (pwd: string): Either<string, string> => pwd.length > 5 ? right(pwd) : left(SHORT);
const oneCapital = (pwd: string): Either<string, string> => /[A-Z]/g.test(pwd) ? right(pwd) : left(NO_CAPITAL);
const log: (v: any) => IO<void> = v => () => console.log(v);

function lift<E, A>(check: (value: string) => Either<E, A>): (value: string) => Either<E[], A> {
    return value => pipe(
        check(value),
        mapLeft(res => [res])
    );
}

const validate = (pwd: string) => [length, oneCapital]
    .map(check => check(pwd))
    .map(mapLeft(Array));

// let monoidEither: Monoid<Either<string[], string>> = {
//     concat: (x,y) => mapLeft(e => either.foldMap),
//     empty: either.of('')
// }

pipe(
    validate("123"),
    log
)();
