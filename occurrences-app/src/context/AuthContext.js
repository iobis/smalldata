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

  return (
    <AuthContext.Provider value={{ claims, loggedIn, setLoggedIn, logIn, logOut }}>
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
