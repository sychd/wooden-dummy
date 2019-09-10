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

function Nothing() {}
Nothing.fmap = () => Nothing;
Nothing.ap = () => Nothing;
Nothing.toString= () => 'Nothing';

function Maybe(value) {}
Maybe.of = v => v == null ? Nothing : new Just(v);

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
