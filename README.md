# Redux Awaiter
Redux Awaiter is a Redux middleware for giving opportunities to await and receive actions in anywhere.

[![build status](https://img.shields.io/travis/yenshih/redux-awaiter/master.svg?style=flat-square)](https://travis-ci.org/yenshih/redux-awaiter)
[![npm version](https://img.shields.io/npm/v/redux-awaiter.svg?style=flat-square)](https://www.npmjs.com/package/redux-awaiter)
[![npm downloads](https://img.shields.io/npm/dm/redux-awaiter.svg?style=flat-square)](https://www.npmjs.com/package/redux-awaiter)

## Motivation

Redux Awaiter is designed to await and receive Redux actions in React components and help us manage local state conveniently.

It's inspired by [Redux Saga](https://github.com/redux-saga/redux-saga/), but the problems they solved are totally different.

## Example

```javascript
class UserListView extends React.PureComponent {
    state = { loading: false };

    componentDidMount() {
        const { actions: { fetchUserList } } = this.props;
        fetchUserList();
        this.setState(state => ({ ...state, loading: true }));
        await take('RECEIVE_USER_LIST');
        this.setState(state => ({ ...state, loading: false }));
    }

    render() {
        return (
            <Spin loading={loading}>
                <ul>
                    {users.map(({ id, name }) => <li key={id}>{name}</li>)}
                </ul>
            </Spin>
        )
    }
}
```

## Installation

```
npm i redux-awaiter -D
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

A pattern is to determine whether an action is matching with another.

```typescript
type Pattern<P = {}, M = {}> = string | RegExp | ((action: Action<P, M>) => boolean);
```

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
const take: <P, M = {}>(pattern: Pattern<P, M>) => Promise<Action<P, M>>;
```

`take` receives a pattern as its single argument, and returns a promise.

That promise will resolve the first matching action which is dispatched.

```javascript
const action = await take('RECEIVE_DATA'); // action.type should be RECEIVE_DATA
```

#### takeAllOf

`takeAllOf` receives an array of patterns as it single argument, and returns an array of promises.

Internally, `takeAllOf(patterns)` is the same with `Promise.all(patterns.map(take))`.

If you need to await and receive multiple actions in specific order, use multiple `await take()` instead.

```javascript
const [{ payload: articles }, { payload: users }] = await takeAllOf(['RECEIVE_ARTICLES', 'RECEIVE_USERS']);
```

#### takeOneOf

`takeOneOf` receives an array of patterns as it single argument, and returns a promise.

Internally, `takeOneOf(patterns)` is the same with `Promise.race(patterns.map(take))`.

```javascript
const { type } = await takeOneOf(['FETCH_USER_SUCCESS', 'FETCH_USER_FAILURE']);
if (type === 'FETCH_USER_SUCCESS') {
    // success
} else {
    // failure
}
```

You might not need `takeOneOf`:
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
