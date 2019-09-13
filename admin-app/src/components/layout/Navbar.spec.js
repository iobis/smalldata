import Navbar from './Navbar'
import React from 'react'
import { AuthContext } from '@smalldata/dwca-lib'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

describe('Navbar', () => {
  let authProviderValue
  let logOut
  let redirectToOceanExpert
  let wrapper

  describe('when logged in as "node manager"', () => {
    it('renders correctly for route / ', () => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
          <AuthContext.Provider value={createAuthProviderValue()}>
            <Navbar/>
          </AuthContext.Provider>
        </MemoryRouter>
      )

      expect(wrapper).toMatchSnapshot()
      expect(wrapper.find('.navbar-start a.navbar-item')).toHaveLength(2)
      wrapper.find('.login-nav-item .auth-button').simulate('click')
      expect(logOut).toHaveBeenCalledTimes(1)
      expect(redirectToOceanExpert).toHaveBeenCalledTimes(0)
    })

    it('renders correctly for route /manage-dataset ', () => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/manage-dataset', key: 'testKey' }]}>
          <AuthContext.Provider value={createAuthProviderValue()}>
            <Navbar/>
          </AuthContext.Provider>
        </MemoryRouter>
      )

      expect(wrapper).toMatchSnapshot()
      expect(wrapper.find('.navbar-start a.navbar-item')).toHaveLength(2)
    })

    it('renders correctly for route /manage-users ', () => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/manage-users', key: 'testKey' }]}>
          <AuthContext.Provider value={createAuthProviderValue()}>
            <Navbar/>
          </AuthContext.Provider>
        </MemoryRouter>
      )

      expect(wrapper).toMatchSnapshot()
      expect(wrapper.find('.navbar-start a.navbar-item')).toHaveLength(2)
    })
  })

  it('renders correctly when logged out', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue({ loggedIn: false })}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.navbar-start a.navbar-item')).toHaveLength(0)
    wrapper.find('.login-nav-item .auth-button').simulate('click')
    expect(redirectToOceanExpert).toHaveBeenCalledTimes(1)
  })

  it('renders correctly when logged in as "researcher"', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
        <AuthContext.Provider value={createAuthProviderValue({ role: 'researcher' })}>
          <Navbar/>
        </AuthContext.Provider>
      </MemoryRouter>
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.navbar-start a.navbar-item')).toHaveLength(0)
    wrapper.find('.login-nav-item .auth-button').simulate('click')
    expect(logOut).toHaveBeenCalledTimes(1)
    expect(redirectToOceanExpert).toHaveBeenCalledTimes(0)
  })

  function createAuthProviderValue(props) {
    logOut = jest.fn()
    redirectToOceanExpert = jest.fn()
    authProviderValue = {
      claims:   { name: 'Charles Darwin' },
      role:     'node manager',
      loggedIn: true,
      logOut,
      redirectToOceanExpert,
      userRef:  'ovZTtaOJZ98xDDY'
    }
    return { ...authProviderValue, ...props }
  }
})
