import awaiters, { Action, Pattern } from '../awaiters';

export const take = <P = {}, M = {}>(pattern: Pattern<P, M>) =>
    new Promise<Action<P, M>>(resolve => awaiters.produce({ pattern, resolve }));
