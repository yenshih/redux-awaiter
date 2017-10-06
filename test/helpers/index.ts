import { Action } from '../../src';

export interface State {
    value: number;
}

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

const createAction = <P>(type: string) => (payload: P): Action<P> => ({ type, payload });

export const increment = createAction<number>(INCREMENT);
export const decrement = createAction<number>(DECREMENT);

export const rootReducer = (state: State = { value: 0 }, { type, payload }: Action<number>) => {
    switch (type) {
        case INCREMENT: return { value: state.value + payload };
        case DECREMENT: return { value: state.value - payload };
        default: return state;
    }
};
