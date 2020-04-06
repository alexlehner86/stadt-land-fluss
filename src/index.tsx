import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { appReducer } from './store/app.reducer';
import { Provider } from 'react-redux';

export const appStore = createStore(appReducer);

ReactDOM.render(
  <Provider store={appStore}><App /></Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
