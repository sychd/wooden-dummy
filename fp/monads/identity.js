//Identity monad. No effects, just to get how to do bind in monad

function Identity(value) {this.value = value;}
Identity.of = value => new Identity(value);
// bind :: (a -> Identity b) -> Identity b
Identity.prototype.bind = function (kleisliFn) {
    return kleisliFn(this.value);
};
Identity.prototype.toString = function () {
    return `Identity(${this.value})`;
};

let identity = Identity.of(4);
let kleisliSquareFn = val => Identity.of(Math.pow(val, 2));
let kleisliSuccFn = val => Identity.of(++val);

// we can mount chains of operations with monads, even with such simple as Identity
let res = identity
    .bind(kleisliSquareFn)
    .bind(kleisliSuccFn);
let res2 = identity.bind(x=> kleisliSquareFn(x).bind(kleisliSuccFn));

console.log(res.toString(), res.toString() === res2.toString());// 3d monad law
