import { take } from './';
import { Action, Pattern } from '../types';

export const takeAllOf = <P = {}, M = {}>(patterns: Pattern<P, M>[]): Promise<Action<P, M>[]> =>
    Promise.all(patterns.map(take));
