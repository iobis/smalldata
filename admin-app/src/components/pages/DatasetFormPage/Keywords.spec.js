import Keywords from './Keywords'
import React from 'react'
import { mount } from 'enzyme'

describe('Keywords', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <Keywords
        keywords={[]}
        onChange={jest.fn()}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
