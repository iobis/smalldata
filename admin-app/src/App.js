import './i18n/i18n'
import InputDataPage from './components/pages/InputDataPage'
import LogInPage from './components/pages/LogInPage'
import ManageDatasetPage from './components/pages/ManageDatasetPage'
import ManageUsersPage from './components/pages/ManageUsersPage'
import Navbar from './components/layout/Navbar'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import { AuthContext, AuthProvider } from '@smalldata/dwca-lib'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
  faAngleDown,
  faCheckCircle,
  faCheck,
  faEnvelope,
  faSearch,
  faTimesCircle,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faAngleDown, faCheck, faEnvelope, faCheckCircle, faSearch, faTimesCircle, faUser)

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <AppDiv/>
      </AuthProvider>
    </BrowserRouter>
  )
}

const AppDiv = () => {
  const { loggedIn, logIn } = useContext(AuthContext)
  if (!loggedIn) logIn()

  return (
    <div className="App">
      <Navbar/>
      <Switch>
        <ProtectedRoute component={ManageDatasetPage} exact path="/"/>
        <ProtectedRoute component={InputDataPage} exact path="/input-data"/>
        <ProtectedRoute component={ManageDatasetPage} exact path="/manage-dataset"/>
        <ProtectedRoute component={ManageUsersPage} exact path="/manage-users"/>
      </Switch>
    </div>
  )
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = useContext(AuthContext)
  const render = (props) => loggedIn
    ? <Component {...props}/>
    : <LogInPage/>
  return (
    <Route {...rest} render={render}/>
  )
}

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  exact:     PropTypes.bool,
  path:      PropTypes.string.isRequired
}
