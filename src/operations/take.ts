import awaiters from '../internal/awaiters';
import { Action, Pattern } from '../types';

export const take = <P = {}, M = {}>(pattern: Pattern<P, M>) =>
    new Promise<Action<P, M>>(resolve => awaiters.produce({ pattern, resolve }));
