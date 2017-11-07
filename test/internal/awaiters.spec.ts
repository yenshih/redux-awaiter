import awaiters from '../../src/internal/awaiters';
import { INCREMENT, increment } from '../helpers';

const incrementAction = increment(1);

describe('awaiters', () => {
    it('works with string pattern', () => {
        const promise = new Promise(resolve => awaiters.produce({
            resolve,
            pattern: INCREMENT,
        } as any));
        expect(awaiters.consume(incrementAction)).toBe(0);
    });

    it('works with RegExp pattern', () => {
        const promise = new Promise(resolve => awaiters.produce({
            resolve,
            pattern: /^INC/,
        } as any));
        expect(awaiters.consume(incrementAction)).toBe(0);
    });

    it('works with function pattern', () => {
        const promise = new Promise(resolve => awaiters.produce({
            resolve,
            pattern: ({ type, payload }) => type.includes('INC') && payload > 0,
        } as any));
        expect(awaiters.consume(incrementAction)).toBe(0);
    });

    it('doesn\'t work with other patterns', () => {
        const promise = new Promise(resolve => awaiters.produce({
            resolve,
            pattern: { type: INCREMENT, payload: 1 },
        } as any));
        expect(awaiters.consume(incrementAction)).toBe(1);
    });
});
