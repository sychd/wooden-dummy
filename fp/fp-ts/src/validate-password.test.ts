// with look at https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

import {either, Either, getValidation, isLeft, left, mapLeft, right} from "fp-ts/lib/Either";
import {sequenceT} from "fp-ts/lib/Apply";
import {getMonoid, isEmpty} from "fp-ts/lib/Array";

const SHORT = "Password should be more than 5";
const NO_CAPITAL = "Password should contain at least 1 capital letter";
const length = (pwd: string): Either<string, string> => pwd.length > 5 ? right(pwd) : left(SHORT);
const oneCapital = (pwd: string): Either<string, string> => /[A-Z]/g.test(pwd) ? right(pwd) : left(NO_CAPITAL);

const validate = (pwd: string): Either<string[], string> => {
    let errors: Either<string[], string>[] = [length, oneCapital]
        .map(check => check(pwd))
        .map(mapLeft<string, string[]>(Array))
        .filter(isLeft);
    let validationEither = getValidation(getMonoid<string>());

    return isEmpty(errors) ? either.of(pwd) : sequenceT(validationEither).apply(null, errors);
};
describe("validate password", () => {
    test('correct pwd', () => {
        let pwd ="Correct123";
        expect(validate(pwd)).toEqual(right(pwd));
    });

    test('no capital', () => {
        let pwd ="incorrect";
        expect(validate(pwd)).toEqual(left([NO_CAPITAL]));
    });

    test('no capital & too short', () => {
        let pwd ="-";
        expect(validate(pwd)).toEqual(left([SHORT, NO_CAPITAL]));
    });
});

