import Navbar from './Navbar'
import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'

describe('Navbar', () => {
  it('renders correctly for route /', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('renders correctly for route /input-data', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/input-data']}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('renders correctly for route /input-data/new', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/input-data/new']}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('renders correctly for route /help', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/help']}>
        <AuthProvider>
          <Navbar/>
        </AuthProvider>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })
})
