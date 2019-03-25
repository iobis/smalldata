import Navbar from './Navbar'
import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'

describe('Navbar', () => {
  it('renders correctly for route /', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <Navbar/>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('renders correctly for route /input-data', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/input-data']}>
        <Navbar/>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('renders correctly for route /input-data/new', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/input-data/new']}>
        <Navbar/>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('renders correctly for route /help', () => {
    expect(renderer.create(
      <MemoryRouter initialEntries={['/help']}>
        <Navbar/>
      </MemoryRouter>
    ).toJSON()).toMatchSnapshot()
  })
})
