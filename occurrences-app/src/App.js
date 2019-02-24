import './App.css'
import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { useOnClickOutside } from './hooks/hooks'

const INPUT_DATA_PAGE = 'InputDataPage'
const HELP_PAGE = 'HelpPage'

export default function App() {
  const [page, setPage] = useState(INPUT_DATA_PAGE)
  const [navbarMenuActive, setNavbarMenuActive] = useState(false)
  const menuRef = useRef()

  useOnClickOutside(menuRef, () => setNavbarMenuActive(false))

  let pageComponent
  if (page === INPUT_DATA_PAGE) pageComponent = <InputDataPage/>
  else if (page === HELP_PAGE) pageComponent = <HelpPage/>
  else pageComponent = <InputDataPage/>

  const onPageChange = (page) => {
    setNavbarMenuActive(false)
    setPage(page)
  }

  return (
    <div className="App">
      <nav className="navbar is-info" role="navigation" ref={menuRef} aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item">
            <p style={{ 'width': 112, 'fontSize': 26, 'fontWeight': 'bold' }}>OBIS</p>
          </a>
          <a
            role="button"
            className="navbar-burger"
            onClick={() => setNavbarMenuActive(!navbarMenuActive)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={classNames('navbar-menu', { 'is-active': navbarMenuActive })}>
          <div className="navbar-start">
            <NavbarItem active={page === INPUT_DATA_PAGE} onClick={() => onPageChange(INPUT_DATA_PAGE)}>
              INPUT DATA
            </NavbarItem>
            <NavbarItem active={page === HELP_PAGE} onClick={() => onPageChange(HELP_PAGE)}>
              HELP
            </NavbarItem>
          </div>
          <div className="navbar-end">
            <a className="navbar-item" onClick={() => console.log('TBD: logout clicked')}>
              <span className="icon" style={{ 'marginRight': 6 }}><i className="fas fa-lg fa-user"></i></span>
              logout
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
  return <div><h3 className="title is-3">Input Data Page</h3></div>
}

function HelpPage() {
  return <div><h3 className="title is-3">Help Page</h3></div>
}
