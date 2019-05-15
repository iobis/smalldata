import PropTypes from 'prop-types'
import React, { createContext, useState } from 'react'

export const AuthContext = createContext([{}, () => {}])

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [claims, setClaims] = useState({})

  function logIn() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token') || localStorage.getItem('jwt')
    if (!token) return
    localStorage.setItem('jwt', token)
    setClaims(parseJwt(token))
    setLoggedIn(true)
  }

  function logOut() {
    localStorage.clear()
    setClaims({})
    setLoggedIn(false)
  }

  function redirectToOceanExpert() {
    const callback = window.location.origin + process.env.PUBLIC_URL
    window.location = 'https://oceanexpert.net/socialsignin/?callback=' + callback
  }

  return (
    <AuthContext.Provider value={{ claims, loggedIn, setLoggedIn, logIn, logOut, redirectToOceanExpert }}>
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
