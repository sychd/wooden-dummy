// Just
function Just(value) {
    this.value = value;
}

Just.prototype.fmap = function (fn) {
    return Maybe.of(fn(this.value));
};
Just.prototype.ap = function (anotherJust) {
    return this.fmap(anotherJust.value);
};
Just.prototype.toString = function () {
    return `Just(${this.value})`
};

// Nothing
function Nothing() {
}

Nothing.fmap = () => Nothing;
Nothing.ap = () => Nothing;
Nothing.toString = () => 'Nothing';

// Maybe
function Maybe(value) {
}

Maybe.of = v => v == null ? Nothing : new Just(v);

// Use
let just3 = Maybe.of(3);
let just5 = Maybe.of(5);
let nothing = Maybe.of(null);

let just10 = just5.fmap(a => a * 2);
let justMul5 = just5.fmap(a => b => a * b);
let just15 = just3.ap(justMul5);
let mulNothing = nothing.ap(justMul5);

console.log('just10', just10.toString());
console.log('just15', just15.toString());
console.log('mulNothing', mulNothing.toString());

// Lifting
function liftA1(fnA1) {
    return fa => fa.fmap(fnA1);
}

let mul3 = a => a * 3;
let liftedMul3 = liftA1(mul3);
let resA1 = liftedMul3(Maybe.of(9));
console.log(resA1.toString());

function liftA2(fnA2) {
    return fa => fb => fb.ap(
        fa.fmap(fnA2)
    );
}

let mulAtoB = a => b => a * b;
let liftedMulAtoB = liftA2(mulAtoB);
let resA2 = liftedMulAtoB(Maybe.of(4))(Maybe.of(7));
console.log(resA2.toString());


function liftA3(fnA3) {
    return fa => fb => fc =>
        fc.ap(
            fb.ap(
                fa.fmap(fnA3)
            )
        );
}

let concatThree = a => b => c =>  a.concat(b).concat(c);
let liftedConcatThree = liftA3(concatThree);
let resA3 = liftedConcatThree(Maybe.of("Hello, "))
                            (Maybe.of("fellow "))
                            (Maybe.of("kids!"));
console.log(resA3.toString());
