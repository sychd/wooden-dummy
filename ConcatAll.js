var source = Rx.Observable.range(0, 3)
    .map(function (x) {
        const ob = 'Ob' + x;
        return Rx.Observable.range(x, 3).map(x => ob + ' ' + x);
    })
    .concatAll(); //same with mergeAll(), but concatAll() keeps timeline

var subscription = source.subscribe(
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