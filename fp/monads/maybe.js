// Just
function Just(value) {
    this.value = value;
}
Just.prototype.bind = function (kleisliFn) {
    return kleisliFn(this.value);
};
Just.prototype.toString = function () {
    return `Just(${this.value})`
};

// Nothing
function Nothing() {}
Nothing.bind = () => Nothing;
Nothing.toString = () => 'Nothing';

// Maybe
function Maybe(value) {}
Maybe.of = v => v == null ? Nothing : new Just(v);
Maybe.fail = () => Nothing;

// example
let musicians = [
    {
        name: "Marko",
        instrument: "Piano"
    },
    {
        name: "Polo",
        instrument: "Guitar"
    }
];
let getMusician = targetName =>
    Maybe.of(
        musicians.find(({name}) => targetName === name)
    );
let pluckObjectProperty = (obj, prop) => Maybe.of(obj[prop]);
let getInstrument = maybeMusician => pluckObjectProperty(maybeMusician, "instrument");


let marko = Maybe.of("Marko");
let adrian = Maybe.of("Adrian");
let markosInstrument = marko.bind(getMusician).bind(getInstrument);
let adriansInstrument = adrian.bind(getMusician).bind(getInstrument);

console.log(markosInstrument.toString(), adriansInstrument.toString());