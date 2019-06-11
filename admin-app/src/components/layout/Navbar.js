/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { hooks } from '@smalldata/dwca-lib'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()
  const { loggedIn } = useContext(AuthContext)
  const [navbarMenuActive, setNavbarMenuActive] = useState(false)
  const menuRef = useRef()
  const hideNavbarMenu = () => setNavbarMenuActive(false)
  hooks.useOnClickOutside(menuRef, hideNavbarMenu)

  return (
    <nav aria-label="main navigation" className="navbar is-info" ref={menuRef} role="navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" onClick={hideNavbarMenu} to="/manage-dataset">
          <p>OBIS</p>
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
        {loggedIn ? (
          <div className="navbar-start">
            <NavbarItem onClick={hideNavbarMenu} to="/manage-dataset">
              {t('navbar.manageDataset')}
            </NavbarItem>
            <NavbarItem onClick={hideNavbarMenu} to="/manage-users">
              {t('navbar.manageUsers')}
            </NavbarItem>
            <NavbarItem onClick={hideNavbarMenu} to="/input-data">
              {t('navbar.inputData')}
            </NavbarItem>
          </div>
        ) : null}
        <LoginNavItem loggedIn={loggedIn}/>
      </div>
    </nav>
  )
}

function LoginNavItem({ loggedIn }) {
  const { claims, logOut, redirectToOceanExpert } = useContext(AuthContext)
  const name = claims && claims.name

  return (
    <div className="login-nav-item navbar-end">
      <span className="navbar-item">{name}</span>
      {loggedIn
        ? <AuthButton labelKey="navbar.logout" onClick={logOut}/>
        : <AuthButton labelKey="navbar.login" onClick={redirectToOceanExpert}/>}
    </div>
  )
}

LoginNavItem.propTypes = {
  loggedIn: PropTypes.bool.isRequired
}

function AuthButton({ labelKey, onClick }) {
  const { t } = useTranslation()

  return (
    <a className="auth-button navbar-item" onClick={onClick}>
      <span className="icon" style={{ 'marginRight': 6 }}>
        <FontAwesomeIcon icon="user"/>
      </span>
      {t(labelKey)}
    </a>
  )
}

AuthButton.propTypes = {
  labelKey: PropTypes.string.isRequired,
  onClick:  PropTypes.func.isRequired
}

const NavbarItem = ({ children, onClick, to }) => (
  <NavLink activeClassName="is-active" className="navbar-item" onClick={onClick} to={to}>
    {children}
  </NavLink>
)

NavbarItem.propTypes = {
  children: PropTypes.string.isRequired,
  onClick:  PropTypes.func.isRequired,
  to:       PropTypes.string.isRequired
}
