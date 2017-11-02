import { take } from './';
import { Action, Pattern } from '../types';

export const takeAllOf = <P = {}, M = {}>(patterns: ReadonlyArray<Pattern<P, M>>): Promise<Array<Action<P, M>>> =>
    Promise.all(patterns.map(take));
