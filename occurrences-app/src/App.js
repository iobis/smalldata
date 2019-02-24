import './App.css'
import React, { useState } from 'react'

const INPUT_DATA_PAGE = 'InputDataPage'
const HELP_PAGE = 'HelpPage'

export default function App() {
  const [page, setPage] = useState(INPUT_DATA_PAGE)

  let pageComponent
  if (page === INPUT_DATA_PAGE) pageComponent = <InputDataPage/>
  else if (page === HELP_PAGE) pageComponent = <HelpPage/>
  else pageComponent = <InputDataPage/>

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
            <a className="navbar-item" onClick={() => setPage(INPUT_DATA_PAGE)}>
              INPUT DATA
            </a>
            <a className="navbar-item" onClick={() => setPage(HELP_PAGE)}>
              HELP
            </a>
          </div>
          <div className="navbar-end">
            <a className="navbar-item" onClick={() => console.log('TBD: logout clicked')}>
              logout
            </a>
          </div>
        </div>
      </nav>
      {pageComponent}
    </div>
  )
}

function InputDataPage() {
  return <div>Input Data Page</div>
}

function HelpPage() {
  return <div>Help Page</div>
}
