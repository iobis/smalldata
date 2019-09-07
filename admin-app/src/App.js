import './i18n/i18n'
import * as SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import NodeManagerRoute from '@smalldata/dwca-lib/src/router/NodeManagerRoute'
import DatasetFormPage from './components/pages/DatasetFormPage/DatasetFormPage'
import ManageDatasetPage from './components/pages/ManageDatasetPage'
import ManageUsersPage from './components/pages/ManageUsersPage'
import Navbar from './components/layout/Navbar'
import React, { useContext } from 'react'
import UserFormPage from './components/pages/UserFormPage'
import { AuthContext, AuthProvider } from '@smalldata/dwca-lib'
import { BrowserRouter, Switch } from 'react-router-dom'
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
          <NodeManagerRoute component={ManageDatasetPage} exact path="/"/>
          <NodeManagerRoute component={ManageDatasetPage} exact path="/manage-dataset"/>
          <NodeManagerRoute component={DatasetFormPage} exact path="/manage-dataset/create"/>
          <NodeManagerRoute component={DatasetFormPage} exact path="/manage-dataset/update/:id"/>
          <NodeManagerRoute component={ManageUsersPage} exact path="/manage-users"/>
          <NodeManagerRoute component={UserFormPage} exact path="/manage-users/create"/>
          <NodeManagerRoute component={UserFormPage} exact path="/manage-users/update/:id"/>
        </Switch>
      </main>
    </div>
  )
}
