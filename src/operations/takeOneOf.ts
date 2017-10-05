import { Pattern } from '../awaiters';
import { take } from './';

export const takeOneOf = <P = {}, M = {}>(patterns: Pattern<P, M>[]) =>
    Promise.race(patterns.map(take));
