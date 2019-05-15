import './i18n/i18n'
import HelpPage from './components/pages/HelpPage'
import InputDataPage from './components/pages/InputDataPage'
import Navbar from './components/layout/Navbar'
import LogInPage from './components/pages/LogInPage'
import PropTypes from 'prop-types'
import { AuthContext, AuthProvider } from './hooks/auth'
import OccurrenceForm from './components/pages/Occurrence/OccurrenceForm'
import React, { useContext } from 'react'
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

const AppDiv = () => {
  const { loggedIn, logIn } = useContext(AuthContext)

  const urlParams = new URLSearchParams(window.location.search)
  if (!loggedIn) {
    const token = urlParams.get('token') || localStorage.getItem('jwt')
    if (token) logIn(token)
  }

  return (
    <div className="App">
      <Navbar/>
      <Switch>
        <Route exact path="/" render={() => loggedIn ? <Redirect to="/input-data"/> : <LogInPage/>}/>
        <ProtectedRoute component={InputDataPage} exact path="/input-data"/>
        <ProtectedRoute component={OccurrenceForm} exact path="/input-data/new"/>
        <Route component={HelpPage} exact path="/help"/>
      </Switch>
    </div>
  )
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={(props) => (
        loggedIn
          ? <Component {...props}/>
          : <Redirect to="/"/>)}/>
  )
}

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  exact:     PropTypes.bool,
  path:      PropTypes.string.isRequired
}
