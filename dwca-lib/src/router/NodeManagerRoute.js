import { AuthContext } from '../context/AuthContext'
import PropTypes from 'prop-types'
import LogInPage from '../components/pages/LogInPage'
import React, { useContext } from 'react'
import { Route } from 'react-router-dom'
import AccessRestrictedPage from '../components/pages/AccessRestrictedPage'

export default function NodeManagerRoute({ component: Component, ...rest }) {
  const { loggedIn, role } = useContext(AuthContext)
  const Page = loggedIn
    ? role === 'node manager'
      ? Component
      : AccessRestrictedPage
    : LogInPage

  return <Route {...rest} render={(props) => <Page {...props}/>}/>
}

NodeManagerRoute.propTypes = {
  component: PropTypes.func.isRequired,
  exact:     PropTypes.bool,
  path:      PropTypes.string.isRequired
}
