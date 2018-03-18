
# Error handling. What to do when error kills stream
Be aware that error that was occurred in stream will complete it  immediately (with no complete cb triggered).
It can be handled by several "breakpoints", like:

 ```javascript
    Rx.Observable.range(0,5)
    .map(v => {
                if (v === 3) throw 'boom';
                return v;
            })
    .catch(v => {
                console.log('catch #1', v);
                return Rx.Observable.throw(v);
            })
    .catch(v => {
                console.log('catch #2', v);
                return Rx.Observable.throw('big ' + v.toUpperCase());
            })
    .subscribe(v => console.log('I got: ' +  v),
    v => console.log('Oh no: ' +  v),
    v => console.log('Successfully completed'));
```
But the complete() callback wil not be invoked (same with onErrorResumenext()).
Output will be:
```javascript
    I got: 0
    I got: 1
    I got: 2
    catch #1, boom
    catch #2, boom
    Oh no: big BOOM
```
 So, as you can see, there is no 4 and 5 - stream is dead.
 When you use long-time living streams it can be a problem.
 For example, you need to handle http error, but keep stream alive.
 The answer is to put catch() directly to http request stream - it will give us desired
 error handling + will keep our main subscription alive:

```javascript
const badRequest = Rx.Observable.throw('Some expected error that should be handled');
 const continuousStream = Rx.Observable
 .interval(500)
 .take(5);
 const errorHandler = v => Rx.Observable.of('ERROR');

 continuousStream
 .switchMap (v => v !== 3 ? Rx.Observable.of(v) : badRequest.catch(errorHandler))
 .subscribe(
 v => console.log('I got: ' +  v),
 v => console.log('Oh no: ' +  v),
 v => console.log('Successfully completed'));
 ```
Output will be:

```javascript
 I got: 0 I got: 1
 I got: 2
 I got: ERROR
 I got: 4
 Successfully completed
 ```

Now you can do partition() on 'ERROR' and handle it as you want without death of continuous stream!