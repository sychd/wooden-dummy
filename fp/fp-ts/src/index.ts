import {IO} from "fp-ts/lib/IO";
const log = (s: unknown): IO<void> => () => console.log(s);
log('Hello world!')();

// import("./monoids");
import("./fetch-data");
