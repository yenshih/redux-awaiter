import { createStore, applyMiddleware } from 'redux';
import { createAwaiterMiddleware, take } from '../../src';
import { INCREMENT, increment, decrement, rootReducer, State } from '../helpers';

const awaiterMiddleware = createAwaiterMiddleware();

const incrementAction = increment(1);
const decrementAction = decrement(2);

describe('take', () => {
    it('works with string pattern', async () => {
        const store = createStore<State>(rootReducer, applyMiddleware(awaiterMiddleware));
        const promise = take<number>(INCREMENT);
        store.dispatch(decrementAction);
        store.dispatch(incrementAction);
        expect(store.getState().value).toBe(-1);
        await expect(promise).resolves.toBe(incrementAction);
    });
    
    it('works with RegExp pattern', async () => {
        const store = createStore<State>(rootReducer, applyMiddleware(awaiterMiddleware));
        const promise = take<number>(/^INC/);
        store.dispatch(decrementAction);
        store.dispatch(incrementAction);
        expect(store.getState().value).toBe(-1);
        await expect(promise).resolves.toBe(incrementAction);
    });
    
    it('works with function pattern', async () => {
        const store = createStore<State>(rootReducer, applyMiddleware(awaiterMiddleware));
        const promise = take<number>(({ type, payload }) => type.includes('INC') && payload > 0);
        store.dispatch(decrementAction);
        store.dispatch(incrementAction);
        expect(store.getState().value).toBe(-1);
        await expect(promise).resolves.toBe(incrementAction);
    });
});
