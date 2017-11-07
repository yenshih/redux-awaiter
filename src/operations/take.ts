import awaiters from '../internal/awaiters';
import { Action, Pattern } from '../types';

export const take = <P = {}, M = {}>(pattern: Pattern<P, M>) =>
    new Promise<Action<P, M>>((resolve, reject) => {
        if (typeof pattern !== 'string' && !(pattern instanceof RegExp) && typeof pattern !== 'function') {
            return reject(new TypeError('take(...): Invalid pattern. Expected string, RegExp or function.'));
        }
        awaiters.produce({ pattern, resolve });
    });
