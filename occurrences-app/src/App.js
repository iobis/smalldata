import './App.css';
import dwca from '@smalldata/dwca-lib'
import logo from './logo.svg';
import React, {Component} from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <dwca.Button/>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
