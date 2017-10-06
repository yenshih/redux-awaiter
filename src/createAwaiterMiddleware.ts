import { Middleware } from 'redux';

import awaiters from './awaiters';

export const createAwaiterMiddleware = (): Middleware => () => next => (action) => {
    awaiters.consume(action as any); // cast AnyAction to standard Action<P, M>
    return next(action);
};
