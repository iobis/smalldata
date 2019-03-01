import HelpPage from './pages/HelpPage'
import InputDataPage from './pages/InputDataPage'
import Navbar from './layout/Navbar'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route component={InputDataPage} exact path="/"/>
          <Route component={InputDataPage} exact path="/input-data"/>
          <Route component={HelpPage} exact path="/help"/>
        </Switch>
      </div>
    </BrowserRouter>
  )
}
