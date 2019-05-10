/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from 'react-router-dom'
import { useOnClickOutside } from '../../hooks/hooks'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()
  const [navbarMenuActive, setNavbarMenuActive] = useState(false)
  const menuRef = useRef()
  const hideNavbarMenu = () => setNavbarMenuActive(false)
  useOnClickOutside(menuRef, hideNavbarMenu)

  return (
    <nav aria-label="main navigation" className="navbar is-info" ref={menuRef} role="navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" onClick={hideNavbarMenu} to="/input-data">
          <p style={{ 'width': 112, 'fontSize': 26, 'fontWeight': 'bold' }}>OBIS</p>
        </Link>
        <a
          className="navbar-burger"
          onClick={() => setNavbarMenuActive(!navbarMenuActive)}
          role="button">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className={classNames('navbar-menu', { 'is-active': navbarMenuActive })}>
        <div className="navbar-start">
          <NavbarItem onClick={hideNavbarMenu} to="/input-data">
            {t('navbar.inputData')}
          </NavbarItem>
          <NavbarItem onClick={hideNavbarMenu} to="/help">
            {t('navbar.help')}
          </NavbarItem>
        </div>
        <div className="navbar-end">
          <a className="navbar-item" onClick={() => console.log('TBD: logout clicked')}>
            <span className="icon" style={{ 'marginRight': 6 }}><FontAwesomeIcon icon="user"/></span>
            {t('navbar.logout')}
          </a>
        </div>
      </div>
    </nav>
  )
}

const NavbarItem = ({ children, onClick, to }) => (
  <NavLink activeClassName="is-active" className="navbar-item" onClick={onClick} to={to}>
    {children}
  </NavLink>
)
