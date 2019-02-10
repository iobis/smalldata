import Button from './Button'
import renderer from 'react-test-renderer'
import React from 'react'

describe('Button', () => {
  it('renders correctly', () => {
    const component = renderer.create(<Button />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
