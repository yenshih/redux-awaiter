import { createStore, applyMiddleware } from 'redux';

import { createAwaiterMiddleware } from '../src';
import { rootReducer, increment, decrement, State } from './helpers';

describe('createAwaiterMiddleware', () => {
    it('must be a function with no argument', () => {
        expect(typeof createAwaiterMiddleware).toBe('function');
        expect(createAwaiterMiddleware.length).toBe(0);
    });

    const awaiterMiddleware = createAwaiterMiddleware();

    describe('awaiterMiddleware', () => {
        it('must be a function with less than or equal to 1 argument', () => {
            expect(typeof awaiterMiddleware).toBe('function');
            expect(awaiterMiddleware.length).toBeLessThanOrEqual(1);
        });

        const nextHandler = awaiterMiddleware({
            getState: jest.fn(),
            dispatch: jest.fn(),
        });

        describe('nextHandler', () => {
            it('must be a function to handle next', () => {
                expect(typeof nextHandler).toBe('function');
                expect(nextHandler.length).toBe(1);
            });

            const next = jest.fn();
            const actionHandler = nextHandler(next);

            describe('actionHandler', () => {
                const action = increment(1);

                it('must be a function to handle action', () => {
                    expect(typeof actionHandler).toBe('function');
                    expect(actionHandler.length).toEqual(1);
                });

                actionHandler(action);

                it('must pass action to next', () => {
                    expect(next.mock.calls.length).toBe(1);
                    expect(next.mock.calls[0][0]).toBe(action);
                });
            });
        });
    });

    const store = createStore<State>(rootReducer, applyMiddleware(awaiterMiddleware));

    it('works with createStore and applyMiddleware', () => {
        expect(store).toHaveProperty('getState');
        expect(store).toHaveProperty('dispatch');
        expect(store).toHaveProperty('replaceReducer');
        expect(store).toHaveProperty('subscribe');
    });

    it('creates a simple redux middleware', () => {
        expect(store.getState().value).toBe(0);
        store.dispatch(increment(1));
        expect(store.getState().value).toBe(1);
        store.dispatch(decrement(2));
        expect(store.getState().value).toBe(-1);
        store.dispatch(increment(1));
        expect(store.getState().value).toBe(0);
    });
});
