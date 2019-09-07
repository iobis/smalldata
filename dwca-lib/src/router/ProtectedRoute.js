import { AuthContext } from '../context/AuthContext'
import PropTypes from 'prop-types'
import LogInPage from '../components/pages/LogInPage'
import React, { useContext } from 'react'
import { Route } from 'react-router-dom'

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { loggedIn } = useContext(AuthContext)
  const Page = loggedIn
    ? Component
    : LogInPage

  return <Route {...rest} render={(props) => <Page {...props}/>}/>
}

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  exact:     PropTypes.bool,
  path:      PropTypes.string.isRequired
}
