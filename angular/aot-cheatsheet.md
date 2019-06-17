# Angular AoT cheatsheet 
###### Extract from https://angular.io/guide/aot-compiler


Ahead-of-Time (AOT), which compiles your app at build time.

        ng build --aot
        ng serve --aot
## Why?
* Faster rendering
* Fewer asynchronous requests
* Smaller Angular framework download size
* Detect template errors earlier
* Better security

## Phases
1 - Code analysis

2 - Code generation

3 - Binding expression validation
## Metadata restrictions
### Phase 1
* No arrow functions (only named functions allowed)

        @Component({
        ...
        providers: [{provide: server, useFactory: () => new Server()}]
        })
* The compiler can only resolve references to exported symbols. It enables limited use of non-exported symbols through folding. It can evaluate the *(foldable)* expression 1 + 2 + 3 + 4 and replace it with the result, 10 (it is *folding*).<br>Not foldable: Spread in literal array, Calls, New
* Decorated component class members must be public. You cannot make an @Input() property private or protected.<br>
Data bound properties must also be public.
* The compiler also supports macros in the form of functions or static methods that return an expression. *forRoot*, *forChild* - existing examples.<br>
Example (It makes smth like folding):

        export function wrapInArray<T>(value: T): T[] {
        return [value];
        }

### Phase 2
## Metadata errors
* Expression form not supported

        // ERROR
        export class Fooish { ... }
        ...
        const prop = typeof Fooish; // typeof is not valid in metadata
        ...
        // bracket notation is not valid in metadata
        { provide: 'token', useValue: { [prop]: 'value' } };
        ...
* Reference to a local (non-exported) symbol<br>

        // ERROR
        let foo: number; // neither exported nor initialized

        @Component({
        selector: 'my-component',
        template: ... ,
        providers: [
            { provide: Foo, useValue: foo }
        ]
        })
        export class MyComponent {}
    You could fix the problem by initializing foo (will be folded). Alternatively, you can fix it by *exporting* foo with the expectation that foo will be assigned. *Exporting* works with `providers`, `animations`. Does not work when requires actual value, e.g. `template`.
* Only initialized variables and constants

        // ERROR - not initialized there (can be also in same file)
        import { someTemplate } from './config';

        @Component({
        selector: 'my-component',
        template: someTemplate
        })
        export class MyComponent {}
    To correct this error, provide the initial value of the variable in an initializer clause on the same line.

        export let someTemplate = '<h1>Greetings from Angular</h1>';
* Reference to a non-exported class
* Reference to a non-exported function. Metadata referenced a function that wasn't exported - **even in the same file**.
        // ERROR
        function myStrategy() { ... }

        ...
        providers: [
            { provide: MyStrategy, useFactory: myStrategy }
        ]
        ...
    Correct:

        export function myStrategy() { ... }
    Angular generates a class factory in a separate module and that factory can only access exported functions.
* Destructured variable or constant not supported.
    Use regular `foo.bar`

        // ERROR
        import { configuration } from './configuration';

        // destructured assignment to foo and bar
        const {foo, bar} = configuration;
        ...
        providers: [
            {provide: Foo, useValue: foo},
            {provide: Bar, useValue: bar},
        ]
* Could not resolve type

    TypeScript understands ambient types so you don't import them. The Angular compiler does not understand a type that you neglect to export or import.

        // ERROR
        @Component({ })
        export class MyComponent {
            constructor (private win: Window) { ... }
        }

        // CORRECTED
        import { Inject } from '@angular/core';

        export const WINDOW = new InjectionToken('Window');
        export function _window() { return window; }

        @Component({
        ...
        providers: [
            { provide: WINDOW, useFactory: _window }
        ]
        })
        export class MyComponent {
            constructor (@Inject(WINDOW) private win: Window) { ... }
        }

* Name expected (Only strings allowed)

        // ERROR
        provider: [{ provide: Foo, useValue: { 0: 'test' } }]
        provider: [{ provide: Foo, useValue: { '0': 'test' } }

* Unsupported enum member name.

    Angular ok with simple Enums ( enum Color {Red, White}) but not with computed ({Param: "Foo".length})

* Tagged template expressions (strings like

       `Hello ${name}`
) are not supported in metadata.
* Symbol reference expected -  if you use an expression in the extends clause of a class.
### Phase 3
Validates the binding expressions in templates. Enable this phase explicitly by adding the compiler option "fullTemplateTypeCheck" in the "angularCompilerOptions" of the project's tsconfig.json 