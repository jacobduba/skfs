import { createStore, applyMiddleware, compose } from 'redux';

// TODO
export default function configureStore() {
    return store =  createStore(
        reducer,
        compose(
            applyMiddleware(thunk),
            window.devToolsExtension && window.devToolsExtension()
        ));
}