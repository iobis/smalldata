import './App.css'
import classNames from 'classnames'
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
            <p style={{ 'width': 112, 'fontSize': 26, 'fontWeight': 'bold' }}>OBIS</p>
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <NavbarItem active={page === INPUT_DATA_PAGE} onClick={() => setPage(INPUT_DATA_PAGE)}>
              INPUT DATA
            </NavbarItem>
            <NavbarItem active={page === HELP_PAGE} onClick={() => setPage(HELP_PAGE)}>
              HELP
            </NavbarItem>
          </div>
          <div className="navbar-end">
            <a className="navbar-item" onClick={() => console.log('TBD: logout clicked')}>
              <span className="icon"><i className="fas fa-user"></i></span>&nbsp;logout
            </a>
          </div>
        </div>
      </nav>
      {pageComponent}
    </div>
  )
}

function NavbarItem({ active, children, onClick }) {
  const className = classNames('navbar-item', { 'is-active': active })
  return (
    <a className={className} onClick={onClick}>
      {children}
    </a>
  )
}

function InputDataPage() {
  return <div>Input Data Page</div>
}

function HelpPage() {
  return <div>Help Page</div>
}
