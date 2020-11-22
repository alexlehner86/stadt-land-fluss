import './index.css';

import { StylesProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './App';
import { appReducer } from './store/app.reducer';

export const appStore = createStore(appReducer);

ReactDOM.render(
    <Provider store={appStore}>
        <StylesProvider injectFirst>
            <App />
        </StylesProvider>
    </Provider>,
    document.getElementById('root')
);
