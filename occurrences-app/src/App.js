import './i18n/i18n'
import * as SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import ProtectedRoute from '@smalldata/dwca-lib/src/router/ProtectedRoute'
import HelpPage from './components/pages/HelpPage'
import InputDataPage from './components/pages/InputDataPage'
import Navbar from './components/layout/Navbar'
import OccurrenceForm from './components/pages/Occurrence/OccurrenceForm'
import React, { useContext } from 'react'
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
      <header>
        <Navbar/>
      </header>
      <Switch>
        <ProtectedRoute component={InputDataPage} exact path="/"/>
        <ProtectedRoute component={InputDataPage} exact path="/input-data"/>
        <ProtectedRoute component={OccurrenceForm} exact path="/input-data/create"/>
        <ProtectedRoute component={OccurrenceForm} exact path="/input-data/update"/>
        <Route component={HelpPage} exact path="/help"/>
      </Switch>
    </div>
  )
}
