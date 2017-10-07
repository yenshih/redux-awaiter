import { take } from './';
import { Action, Pattern } from '../types';

export const takeOneOf = <P = {}, M = {}>(patterns: Pattern<P, M>[]): Promise<Action<P, M>> =>
    Promise.race(patterns.map(take));
