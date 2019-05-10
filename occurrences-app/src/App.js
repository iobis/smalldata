import './i18n/i18n'
import HelpPage from './components/pages/HelpPage'
import InputDataPage from './components/pages/InputDataPage'
import Navbar from './components/layout/Navbar'
import OccurrenceForm from './components/pages/Occurrence/OccurrenceForm'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { faAngleDown, faCheckCircle, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faAngleDown, faEnvelope, faCheckCircle, faUser)

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route component={InputDataPage} exact path="/"/>
          <Route component={InputDataPage} exact path="/input-data"/>
          <Route component={OccurrenceForm} exact path="/input-data/new"/>
          <Route component={HelpPage} exact path="/help"/>
        </Switch>
      </div>
    </BrowserRouter>
  )
}
