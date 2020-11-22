import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './App';
import { appReducer } from './store/app.reducer';

export const appStore = createStore(appReducer);

ReactDOM.render(
  <Provider store={appStore}><App /></Provider>,
  document.getElementById('root')
);
