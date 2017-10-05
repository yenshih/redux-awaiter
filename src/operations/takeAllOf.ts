import { Action, Pattern } from '../awaiters';
import { take } from './';

export const takeAllOf = <P = {}, M = {}>(patterns: Pattern<P, M>[]): Promise<Action<P, M>[]> =>
    Promise.all(patterns.map(take));
