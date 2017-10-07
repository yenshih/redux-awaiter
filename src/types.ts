export type ActionType = string;

export interface BaseAction {
    type: ActionType;
}

export interface Action<P, M = {}> extends BaseAction {
    payload: P;
    meta?: M;
    error?: true;
}

export type Pattern<P = {}, M = {}> = string | RegExp | ((action: Action<P, M>) => boolean);

export interface Awaiter<P = {}, M = {}> {
    pattern: Pattern<P, M>;
    resolve: (action: Action<P, M>) => void;
}
