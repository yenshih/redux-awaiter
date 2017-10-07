import { Action, Pattern, Awaiter } from '../types';

export class Awaiters {
    public static get Instance() {
        return this.instance;
    }

    private static readonly instance: Awaiters = new Awaiters();

    private static consumer<P, M>(action: Action<P, M>) {
        return ({ pattern, resolve }: Awaiter<P, M>) => {
            const isMatch = ((action: Action<P, M>, pattern: Pattern<P, M>): boolean => {
                const { type } = action;
                if (typeof pattern === 'string') {
                    return type === pattern;
                }
                if (pattern instanceof RegExp) {
                    return pattern.test(type);
                }
                if (typeof pattern === 'function') {
                    return pattern(action);
                }
                return false;
            })(action, pattern);
            isMatch && resolve(action);
            return !isMatch;
        };
    }

    private awaiters: ReadonlyArray<Readonly<Awaiter<any>>> = [];

    private constructor() {}

    public produce<P = {}, M = {}>(awaiter: Awaiter<P, M>) {
        this.awaiters = [...this.awaiters, awaiter];
        return this.awaiters.length;
    }

    public consume<P = {}, M = {}>(action: Action<P, M>) {
        this.awaiters = this.awaiters.filter(Awaiters.consumer(action));
        return this.awaiters.length;
    }
}

const awaiters = Awaiters.Instance;

export default awaiters;
