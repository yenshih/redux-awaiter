# Redux Awaiter
Redux Awaiter is a Redux middleware for giving opportunities to await and receive actions in anywhere.

It's tiny (gzip < 1kB, no dependencies).

[![build status](https://img.shields.io/travis/yenshih/redux-awaiter/master.svg?style=flat-square)](https://travis-ci.org/yenshih/redux-awaiter)
[![Coverage Status](https://img.shields.io/coveralls/yenshih/redux-awaiter/master.svg?style=flat)](https://coveralls.io/github/yenshih/redux-awaiter?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-awaiter.svg?style=flat-square)](https://www.npmjs.com/package/redux-awaiter)
[![npm downloads](https://img.shields.io/npm/dm/redux-awaiter.svg?style=flat-square)](https://www.npmjs.com/package/redux-awaiter)

## Motivation

*[Local state is fine](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)*.

Redux Awaiter is designed to help us manage local state conveniently.

It's inspired by [Redux Saga](https://github.com/redux-saga/redux-saga/), but the problems they solve are totally different.

## Example

We can use Redux Awaiter and `async/await` to pause execution until an expected action has been dispatched.

```javascript
class UserListView extends React.PureComponent {
    state = { loading: false };

    async componentDidMount() {
        const { actions: { fetchUserList } } = this.props;
        fetchUserList();
        this.setState(state => ({ ...state, loading: true }));
        // start loading, until RECEIVE_USER_LIST has been dispatched
        await take('RECEIVE_USER_LIST');
        // reducers may update `users` in redux store, stop loading
        this.setState(state => ({ ...state, loading: false }));
    }

    render() {
        const { users } = this.props; // `users` is mapped from redux store
        const { loading } = this.state;
        return (
            <Spin loading={loading}>
                <ul>
                    {users.map(({ id, name }) => <li key={id}>{name}</li>)}
                </ul>
            </Spin>
        );
    }
}
```

## Installation

```
npm i redux-awaiter
```

## Documentation

### Type Definition

Redux Awaiter is written in [TypeScript](http://www.typescriptlang.org/).

The internal type definition is based on [flux standard action](https://github.com/acdlite/flux-standard-action).

```typescript
type ActionType = string;

interface BaseAction {
    type: ActionType;
}

interface Action<P, M = {}> extends BaseAction {
    payload: P;
    meta?: M;
    error?: true;
}
```

A pattern determines whether an action is matching.

```typescript
type Pattern<P = {}, M = {}> = string | RegExp | ((action: Action<P, M>) => boolean);
```

`object` pattern is not supported, use a function instead.

### API

#### createAwaiterMiddleware

```javascript
import { createStore, applyMiddleware } from 'redux';
import { createAwaiterMiddleware } from 'redux-awaiter';

const awaiterMiddleware = createAwaiterMiddleware();

const store = createStore(rootReducer, applyMiddleware(
    // other middlewares (e.g. routerMiddleware)
    awaiterMiddleware,
));
```

#### take

```typescript
const take: <P = {}, M = {}>(pattern: Pattern<P, M>) => Promise<Action<P, M>>;
```

`take` receives a pattern as its single argument, and returns a Promise which contains the first matching action.

```javascript
const action = await take('RECEIVE_DATA'); // action.type should be RECEIVE_DATA
```

#### takeAllOf

```typescript
const takeAllOf: <P = {}, M = {}>(patterns: Pattern<P, M>[]) => Promise<Action<P, M>[]>;
```

`takeAllOf` receives an array of patterns as its single argument, and returns a Promise which contains an array of actions corresponding to patterns.

Internally, `takeAllOf(patterns)` is the same with `Promise.all(patterns.map(take))`.

If you need to await and receive multiple actions in specific order, use multiple `await take()` instead.

```javascript
const [{ payload: articles }, { payload: users }] = await takeAllOf(['RECEIVE_ARTICLES', 'RECEIVE_USERS']);
```

#### takeOneOf

```typescript
const takeOneOf: <P = {}, M = {}>(patterns: Pattern<P, M>[]) => Promise<Action<P, M>>;
```

`takeOneOf` receives an array of patterns as its single argument, and returns a Promise which contains the first action matching with one of patterns.

Internally, `takeOneOf(patterns)` is the same with `Promise.race(patterns.map(take))`.

```javascript
const { type } = await takeOneOf(['FETCH_USER_SUCCESS', 'FETCH_USER_FAILURE']);
if (type === 'FETCH_USER_SUCCESS') {
    // success
} else {
    // failure
}
```

You might not need `takeOneOf`.
```javascript
const { type } = await take(/^FETCH_USER/);
```

### DO NOT OVERUSE

Avoid relying on props MUTATION!

This may cause unexpected behaviors, or make your components difficult to maintain.

```javascript
async componentDidMount() {
    const { data } = this.props // this.props.data is mapped from redux store.
    // dispatch an action and do some async call (e.g. xhr, fetch)
    await take('RECEIVE_DATA'); // receive new data and update redux store by reducer
    // DANGER: this.props.data is MUTATED!
    console.assert(this.props.data === data); // Assertion failed!
}
```
