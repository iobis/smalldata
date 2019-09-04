import Navbar from './Navbar'
import React from 'react'
import { AuthContext } from '@smalldata/dwca-lib'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

describe('Navbar', () => {
  let logOut
  let redirectToOceanExpert
  let authProviderValue

  it('renders correctly for route /', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue()}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly for route /input-data', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/input-data', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue()}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly for route /input-data/create', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/input-data/create', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue()}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly for route /help', () => {
    expect(mount(
      <MemoryRouter initialEntries={[{ pathname: '/help', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue()}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )).toMatchSnapshot()
  })

  it('renders correctly when logged in', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue()}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.login-nav-item .auth-button').simulate('click')
    expect(logOut).toHaveBeenCalledTimes(1)
  })

  it('renders correctly when logged out', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue({ loggedIn: false })}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.login-nav-item .auth-button').simulate('click')
    expect(redirectToOceanExpert).toHaveBeenCalledTimes(1)
  })

  function createAuthProviderValue(props) {
    logOut = jest.fn()
    redirectToOceanExpert = jest.fn()
    authProviderValue = {
      claims:   { name: 'Charles Darwin' },
      loggedIn: true,
      logOut,
      redirectToOceanExpert,
      userRef:  'ovZTtaOJZ98xDDY'
    }
    return { ...authProviderValue, ...props }
  }
})
