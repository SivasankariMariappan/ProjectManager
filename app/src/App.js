import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import getAppStore from './store/store';

const store = getAppStore();

class App extends Component {
  render() {
    return (
     <Provider store={store}>
        <AppRouter />
    </Provider>
    );
  };
};

export default App;
