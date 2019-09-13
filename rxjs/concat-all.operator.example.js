const { map, concatAll } = require("rxjs/operators");
const { range } = require("rxjs");

const source = range(0, 3).pipe(
    map(x => {
            const ob = `Ob${x}`;
            return range(x, 3).pipe(
                map(x => `${ob} ${x}`)
            );
        }
    ),
    concatAll()//same with mergeAll(), but concatAll() keeps timeline
);

source.subscribe(
    function (x) {
        console.log('Next: %s', x);
    },
    function (err) {
        console.log('Error: %s', err);
    },
    function () {
        console.log('Completed');
    });


// Next: Ob0 0
// Next: Ob0 1
// Next: Ob0 2
// Next: Ob1 1
// Next: Ob1 2
// Next: Ob1 3
// Next: Ob2 2
// Next: Ob2 3
// Next: Ob2 4
// Completed