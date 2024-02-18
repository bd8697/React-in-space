import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import universalStore from './store/UniversalStore';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={universalStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
