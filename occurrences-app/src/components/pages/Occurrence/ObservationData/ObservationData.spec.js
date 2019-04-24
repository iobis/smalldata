import React from 'react'
import renderer from 'react-test-renderer'
import ObservationData from './ObservationData'

describe('ObservationData', () => {
  it('renders correctly', () => {
    expect(renderer.create(createComponent()).toJSON()).toMatchSnapshot()
  })
})

function createComponent() {
  return (
    <ObservationData onChange={jest.fn()}/>
  )
}
