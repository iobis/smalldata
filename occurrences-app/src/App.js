import './App.css'
import HelpPage from './pages/HelpPage'
import InputDataPage from './pages/InputDataPage'
import Navbar from './layout/Navbar'
import React, { useState } from 'react'
import { INPUT_DATA_PAGE, HELP_PAGE } from './pages'

export default function App() {
  const [activePage, setActivePage] = useState(INPUT_DATA_PAGE)

  const activePageComponent = activePage === HELP_PAGE
    ? <HelpPage/>
    : <InputDataPage/>

  return (
    <div className="App">
      <Navbar activePage={activePage} onPageChange={setActivePage}/>
      {activePageComponent}
    </div>
  )
}
