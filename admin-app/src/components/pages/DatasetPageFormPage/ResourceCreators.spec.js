import ResourceCreators from './ResourceCreators'
import React from 'react'
import { mount } from 'enzyme'

describe('ResourceCreators', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <ResourceCreators
        data={[]}
        onChange={jest.fn()}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
