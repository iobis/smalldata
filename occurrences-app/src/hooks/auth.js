import PropTypes from 'prop-types'
import React, { createContext, useContext, useState } from 'react'

export const AuthContext = createContext([ {}, () => {}]);

export const AuthProvider = (props) => {
  const [state, setState] = useState({loggedIn: false})
  return (
    <AuthContext.Provider value={[state, setState]}>
      {props.children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
}


const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export const useAuth = () => {
  const [auth, setAuth] = useContext(AuthContext);

  function logIn(token) {
    localStorage.setItem('jwt', token)
    setClaims(parseJwt(token))
    setAuth(auth => ({ ...auth, loggedIn: true }))
  }

  function logOut() {
    localStorage.clear()
    setAuth(auth => ({ ...auth, loggedIn: false }))
  }

  function setClaims(claims) {
    setAuth(auth => ({...auth, claims: claims}))
  }


  return { auth, logIn, logOut }
}
