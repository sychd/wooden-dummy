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

* Type narrowing
    The expression used in an ngIf directive is used to narrow type unions in the Angular template compiler, the same way the if expression does in TypeScript. For example, to avoid Object is possibly 'undefined' error in the template above, modify it to only emit the interpolation if the value of person is initialized  `template: '<span *ngIf="person"> {{person.addresss.street}} </span>'
}`

* Custom ngIf like directives

    
    Signal to the template compiler to treat them like *ngIf - `public static ngIfUseIfTypeGuard: void;`
* Non-null type assertion operator
      
        <!--No color, no error -->
        <p *ngIf="item">The item's color is: {{item!.color}}</p>

    Unlike the safe navigation operator, the non-null assertion operator does not guard against null or undefined. Rather, it tells the TypeScript type checker to suspend strict null checks for a specific property expression.

* Disabling type checking using $any()

        template: '{{$any(person).addresss.street}}'

## Configuration inheritance with extends
Similar to TypeScript Compiler, Angular Compiler also supports extends in the tsconfig.json on angularCompilerOptions
### Angular template compiler options
    {
        "compilerOptions": {
            "experimentalDecorators": true,
                    ...
        },
        "angularCompilerOptions": {
            "fullTemplateTypeCheck": true,
            "preserveWhitespaces": true,
                    ...
        }
    }

* enableResourceInlining 

    replace the templateUrl and styleUrls property with inlined contents 
* skipMetadataEmit 

    not to produce .metadata.json files (false by default) This option should be set to true if you are using TypeScript's --outFile option, because the metadata files are not valid for this style of TypeScript output. It is not recommended to use --outFile with Angular. 
* strictMetadataEmit
* skipTemplateCodegen 

    suppress emitting .ngfactory.js and .ngstyle.js files
* strictInjectionParameters

    When set to true, this options tells the compiler to report an error for a parameter supplied whose injection type cannot be determined. When this option is not provided or is false, constructor parameters of classes marked with @Injectable whose type cannot be resolved will produce a warning.

* flatModuleOutFile

    When set to true, this option tells the template compiler to generate a flat module index of the given file name and the corresponding flat module metadata. 

* flatModuleId

    This option specifies the preferred module id to use for importing a flat module. This is only meaningful when flatModuleOutFile is also supplied

* generateCodeForLibraries
* fullTemplateTypeCheck
* annotateForClosureCompiler
* annotationsAs
* trace
* enableLegacyTemplate
* disableExpressionLowering
* disableTypeScriptVersionCheck
* preserveWhitespaces
* allowEmptyCodegenFiles
