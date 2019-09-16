import {taskEither, tryCatch} from "fp-ts/lib/TaskEither";
import {log} from "fp-ts/lib/Console";
import {identity} from "fp-ts/lib/Identity";
import {IO} from "fp-ts/lib/IO";
import {eitherT} from "fp-ts";
import {chain, fromNullable, mapNullable, option, Option} from "fp-ts/lib/Option";
import {pipe} from "fp-ts/lib/pipeable";

interface DataResponse {
    data: null | undefined | string;
}

// Simulate request - can be successful with/without data or failed
const fetchData = (data: null | undefined | string, isFailed: boolean): () => Promise<DataResponse> =>
    () => isFailed ? Promise.reject(new Error("fail")) : Promise.resolve({data});

const succEmptyDataFetch = fetchData(null, false);
const succFilledFetch = fetchData("Some data", false);
const failFetch = fetchData(null, true);

const tapIO = <T>(getIO: (arg: T) => IO<void>) => (arg: T): T => {
    getIO(arg)();
    return arg;
};

const performRequest = (request: () => Promise<DataResponse>) => tryCatch(
    () => request()
        .then(tapIO(log)),
    reason => new Error(String(reason))
);

const onResult: (value: DataResponse) => Option<string> = (value: DataResponse) => pipe(
    fromNullable<DataResponse>(value),
    mapNullable(value => value.data),
    nonemptyAction,
    tapIO<Option<string>>(log)
);

function nonemptyAction(fData: Option<string>) {
    return option.map(fData, value => "Some mapped: ".concat(value));
}

//todo: rewrite to tests
taskEither.map(performRequest(succEmptyDataFetch), onResult)();
taskEither.map(performRequest(succFilledFetch), onResult)();
taskEither.bimap(performRequest(failFetch), e => console.error("error", e.toString()), onResult)();
