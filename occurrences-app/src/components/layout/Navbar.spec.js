import Navbar from './Navbar'
import React from 'react'
import { AuthContext, AuthProvider } from '../../context/AuthContext'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

describe('Navbar', () => {
  it('renders correctly for route /', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly for route /input-data', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/input-data', key: 'testKey' }]}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly for route /input-data/new', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/input-data/new', key: 'testKey' }]}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly for route /help', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/help', key: 'testKey' }]}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly when logged in', () => {
    const logOut = jest.fn()
    const authProviderValue = {
      claims:   { name: 'Zeus' },
      loggedIn: true,
      logOut:   logOut
    }

    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthContext.Provider value={authProviderValue}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })
})
