import Button from './Button'
import renderer from 'react-test-renderer'
import React from 'react'

const noop = ()=>{}

describe('Button', () => {
  it('renders correctly', () => {
    expect(renderer.create(<Button/>).toJSON()).toMatchSnapshot()
    expect(renderer.create(<Button onClick={noop}/>).toJSON()).toMatchSnapshot()
    expect(renderer.create(<Button>click me</Button>).toJSON()).toMatchSnapshot()
  })
})
