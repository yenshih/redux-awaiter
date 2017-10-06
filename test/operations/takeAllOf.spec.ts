import { createStore, applyMiddleware } from 'redux';
import { createAwaiterMiddleware, takeAllOf } from '../../src';
import { INCREMENT, DECREMENT, increment, decrement, rootReducer, State } from '../helpers';

const awaiterMiddleware = createAwaiterMiddleware();

describe('takeAllOf', () => {
    it('works', async () => {
        const store = createStore<State>(rootReducer, applyMiddleware(awaiterMiddleware));
        const promise = takeAllOf<number>([INCREMENT, DECREMENT]);
        const incrementAction = increment(1);
        const decrementAction = decrement(2);
        store.dispatch(decrementAction);
        store.dispatch(incrementAction);
        expect(store.getState().value).toBe(-1);
        await expect(promise).resolves.toEqual([incrementAction, decrementAction]);
    });
});
