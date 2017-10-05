import { Action, Pattern } from '../awaiters';
import { take } from './';

export const takeOneOf = <P = {}, M = {}>(patterns: Pattern<P, M>[]): Promise<Action<P, M>> =>
    Promise.race(patterns.map(take));
