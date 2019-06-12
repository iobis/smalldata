import InputDataPage from './InputDataPage'
import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'

describe('InputDataPage', () => {
  it('renders correctly /', () => {
    expect(renderer.create(<MemoryRouter><InputDataPage/></MemoryRouter>).toJSON()).toMatchSnapshot()
  })
})
