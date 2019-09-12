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
let findMusicianByName = (musicians => targetName =>
    Maybe.of(
        musicians.find(({name}) => targetName === name)
    )
)(musicians);
let getInstrument = musician => Maybe.of(musician.instrument);

let marko = Maybe.of("Marko");
let adrian = Maybe.of("Adrian");

let markosInstrument = marko
    .bind(findMusicianByName)
    .bind(getInstrument);
console.log(markosInstrument.toString());

let adriansInstrument = adrian
    .bind(findMusicianByName)
    .bind(getInstrument);// getInstrument won't be called - Nothing.bind does not call passed function at all
console.log(adriansInstrument.toString());