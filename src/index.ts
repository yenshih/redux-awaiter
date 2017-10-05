import { Middleware } from 'redux';

import awaiters from './awaiters';

export const createAwaiterMiddleware = (): Middleware => () => next => (action) => {
    awaiters.consume(action as any); // cast AnyAction to standard Action<T>
    return next(action);
};

export * from './awaiters';
export * from './operations';
