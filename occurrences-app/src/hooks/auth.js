import PropTypes from 'prop-types'
import React, { createContext, useState } from 'react'

export const AuthContext = createContext([{}, () => {}])

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [claims, setClaim] = useState({})

  function logIn(token) {
    localStorage.setItem('jwt', token)
    const claims = parseJwt(token)
    setClaim(claims)
    setLoggedIn(true)
  }

  function logOut() {
    localStorage.clear()
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
    return null
  }
}
