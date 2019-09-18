import {chain, IO, io} from "fp-ts/lib/IO";
import {either, Either, left, right} from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import {array} from "fp-ts/lib/Array";

window.onload = () => {
    let writeToLogBlock = (e: Event) => document.querySelector('.log-container').innerHTML = (e.target as HTMLElement).className;
    // document.querySelectorAll('.circle').forEach(circle => {
    //     circle.addEventListener('click', (e) => {
    //         writeToLogBlock(e);
    //     });
    // });

    let documentIO: IO<Document> = io.of(document);

    let queryElements = (documentIO: IO<Document>) => (selector: string): IO<Either<string, Element[]>> =>
        io.map(documentIO, (document: Document) => {
                let elements = document.querySelectorAll(selector);
                return elements.length ? right(Array.from(elements)) : left("No elements were found");
            }
        );
    let on = (type: string) => (fn: (e: Event) => void) => (el: Element): void => el.addEventListener(type, fn);
    let addClickLogListener: (el: Element) => void = on('click')(writeToLogBlock);
    let attachListener = (listener: (el: Element) => void) => (elems: Either<string, Element[]>) => {
        return either.map(elems, arr => arr.map(listener));
    };
    let attachClickListenersToElems = attachListener(addClickLogListener);
    let els: IO<Either<string, Element[]>> = queryElements(documentIO)('.circle');

    io.map(els, attachClickListenersToElems)();
    pipe(
        queryElements(documentIO)('.circle'),
        chain(v => io.of(1))
    );

    // well, seems not as expected
    io.map(els,
        (els: Either<string, Element[]>) =>
            either.map(els, (arr: Array<Element>) =>
                array.map(arr, addClickLogListener)
            )
    )();
    // io.chain(els, (els: Either<string, Element[]>) => els);
};
