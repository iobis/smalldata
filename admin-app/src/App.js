import './i18n/i18n'
import * as SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import AccessRestrictedPage from '@smalldata/dwca-lib/src/components/pages/AccessRestrictedPage'
import DatasetFormPage from './components/pages/DatasetFormPage/DatasetFormPage'
import LogInPage from '@smalldata/dwca-lib/src/components/pages/LogInPage'
import ManageDatasetPage from './components/pages/ManageDatasetPage'
import ManageUsersPage from './components/pages/ManageUsersPage'
import Navbar from './components/layout/Navbar'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import UserFormPage from './components/pages/UserFormPage'
import { AuthContext, AuthProvider } from '@smalldata/dwca-lib'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
  faAngleDown,
  faCheck,
  faCheckCircle,
  faEnvelope,
  faSearch,
  faTimesCircle,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faAngleDown, faCheck, faEnvelope, faCheckCircle, faSearch, faTimesCircle, faUser)

export default function App() {
  SmalldataClient.init(window.smalldata)
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
      <main>
        <Switch>
          <ProtectedRoute component={ManageDatasetPage} exact path="/"/>
          <ProtectedRoute component={ManageDatasetPage} exact path="/manage-dataset"/>
          <ProtectedRoute component={DatasetFormPage} exact path="/manage-dataset/create"/>
          <ProtectedRoute component={DatasetFormPage} exact path="/manage-dataset/update/:id"/>
          <ProtectedRoute component={ManageUsersPage} exact path="/manage-users"/>
          <ProtectedRoute component={UserFormPage} exact path="/manage-users/create"/>
          <ProtectedRoute component={UserFormPage} exact path="/manage-users/update/:id"/>
        </Switch>
      </main>
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
