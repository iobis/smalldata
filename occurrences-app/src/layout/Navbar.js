import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { useOnClickOutside } from '../hooks/hooks'
import { INPUT_DATA_PAGE, HELP_PAGE } from '../pages'

export default function Navbar({ activePage, onPageChange }) {
  const [navbarMenuActive, setNavbarMenuActive] = useState(false)
  const menuRef = useRef()

  const onPageItemClick = (page) => {
    setNavbarMenuActive(false)
    onPageChange(page)
  }

  useOnClickOutside(menuRef, () => setNavbarMenuActive(false))

  return (
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
          <NavbarItem active={activePage === INPUT_DATA_PAGE} onClick={() => onPageItemClick(INPUT_DATA_PAGE)}>
            INPUT DATA
          </NavbarItem>
          <NavbarItem active={activePage === HELP_PAGE} onClick={() => onPageItemClick(HELP_PAGE)}>
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
