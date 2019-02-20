import './App.css'
import dwca from '@smalldata/dwca-lib'
import logo from './logo.svg'
import React, {useState} from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(count + 1)
  const decrementCount = () => setCount(count - 1)

  return (
    <div className="App">
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
