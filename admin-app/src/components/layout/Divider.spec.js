import Divider from './Divider'
import React from 'react'
import renderer from 'react-test-renderer'

describe('Divider', () => {
  it('renders correctly', () => {
    expect(renderer.create(<Divider>some text</Divider>).toJSON()).toMatchSnapshot()
  })
})
