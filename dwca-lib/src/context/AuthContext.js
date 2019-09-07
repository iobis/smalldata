import PropTypes from 'prop-types'
import React, { createContext, useState } from 'react'
import * as SmalldataClient from '../clients/SmalldataClient'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [userRef, setUserRef] = useState('')
  const [role, setRole] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [claims, setClaims] = useState({})

  async function logIn() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token') || localStorage.getItem('jwt')
    if (!token) return
    SmalldataClient.setSecurityToken(token)
    localStorage.setItem('jwt', token)
    const claims = parseJwt(token)
    const user = await SmalldataClient.getUserByEmail(claims.email)
    setUserRef(user.id)
    setRole(user.role)
    setClaims(claims)
    setLoggedIn(true)
  }

  function logOut() {
    SmalldataClient.deleteSecurityToken()
    localStorage.clear()
    setUserRef('')
    setClaims({})
    setLoggedIn(false)
  }

  function redirectToOceanExpert() {
    const callback = window.location.origin + process.env.PUBLIC_URL
    window.location = 'https://oceanexpert.net/socialsignin/?callback=' + callback
  }

  return (
    <AuthContext.Provider
      value={{ userRef, role, claims, loggedIn, setLoggedIn, logIn, logOut, redirectToOceanExpert }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return {}
  }
}
