import InputDataPage from './InputDataPage'
import React from 'react'
import renderer from 'react-test-renderer'

describe('InputDataPage', () => {
  it('renders correctly /', () => {
    expect(renderer.create(<InputDataPage/>).toJSON()).toMatchSnapshot()
  })
})
