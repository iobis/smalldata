import './App.css'
import dwca from '@smalldata/dwca-lib'
import logo from './logo.svg'
import React, { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(count + 1)
  const decrementCount = () => setCount(count - 1)

  return (
    <div className="App">
      <nav className="navbar is-info" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item">
            <p style={{ 'width': 112, 'font-size': 26, 'font-weight': 'bold' }}>OBIS</p>
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">
              INPUT DATA
            </a>
            <a className="navbar-item">
              HELP
            </a>
          </div>
          <div className="navbar-end">
            <a className="navbar-item">
              logout
            </a>
          </div>
        </div>
      </nav>
      <div>{count}</div>
      <dwca.Button onClick={decrementCount}>-</dwca.Button>
      <dwca.Button onClick={incrementCount}>+</dwca.Button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}
