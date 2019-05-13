import './i18n/i18n'
import HelpPage from './components/pages/HelpPage'
import InputDataPage from './components/pages/InputDataPage'
import Navbar from './components/layout/Navbar'
import PropTypes from 'prop-types'
import { AuthProvider, useAuth } from './hooks/auth'

import OccurrenceForm from './components/pages/Occurrence/OccurrenceForm'
import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
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

const SecureRoute = ({ component: Component, ...rest }) => {
  const { auth } = useAuth()

  return (
    <Route
      {...rest}
      render = {(props) => auth.loggedIn ?
        <Component {...props}/> : <Redirect to="/"/>}/>
  )
}

SecureRoute.propTypes = {
  component: PropTypes.func.isRequired,
  exact:     PropTypes.bool,
  path:      PropTypes.string.isRequired
}

const AppDiv = () => {
  const { auth, logIn } = useAuth()

  const urlParams = new URLSearchParams(window.location.search)
  if (!auth.loggedIn) {
    const token = urlParams.get('token') || localStorage.getItem('jwt')
    if (token) logIn(token)
  }

  return (
    <div className="App">
      <Navbar/>
      <Switch>
        <Route
          exact path="/" render = {() => auth.loggedIn ?
            <Redirect to="/input-data"/> :
            <div>Please log in!</div>}/>
        <SecureRoute component={InputDataPage} exact path="/input-data"/>
        <SecureRoute component={OccurrenceForm} exact path="/input-data/new"/>
        <Route component={HelpPage} exact path="/help"/>
      </Switch>
    </div>
  )
}
