/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from 'react-router-dom'
import { useOnClickOutside } from '../../hooks/hooks'
import { useAuth } from '../../hooks/auth'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const [navbarMenuActive, setNavbarMenuActive] = useState(false)
  const menuRef = useRef()
  const hideNavbarMenu = () => setNavbarMenuActive(false)
  useOnClickOutside(menuRef, hideNavbarMenu)

  return (
    <nav aria-label="main navigation" className="navbar is-info" ref={menuRef} role="navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" onClick={hideNavbarMenu} to="/input-data">
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
        {auth.loggedIn ? (
          <div className="navbar-start">
            <NavbarItem onClick={hideNavbarMenu} to="/input-data">
              {t('navbar.inputData')}
            </NavbarItem>
            <NavbarItem onClick={hideNavbarMenu} to="/help">
              {t('navbar.help')}
            </NavbarItem>
          </div>
        ) : null}
        <LoginNabItem loggedIn={auth.loggedIn}/>
      </div>
    </nav>
  )
}

function LoginNabItem({ loggedIn }) {
  const { auth, logOut } = useAuth()
  const name = auth.claims && auth.claims.name

  function redirectToOceanExpert() {
    const callback = window.location.origin + process.env.PUBLIC_URL
    window.location = 'https://oceanexpert.net/socialsignin/?callback=' + callback
  }

  return (
    <div className="navbar-end">
      <span className="navbar-item">{name}</span>
      {loggedIn
        ? <AuthButton labelKey="navbar.logout" onClick={logOut}/>
        : <AuthButton labelKey="navbar.login" onClick={redirectToOceanExpert}/>}
    </div>
  )
}

LoginNabItem.propTypes = {
  loggedIn: PropTypes.bool.isRequired
}

function AuthButton({ labelKey, onClick }) {
  const { t } = useTranslation()

  return (
    <a className="navbar-item" onClick={onClick}>
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
