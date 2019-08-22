import MetadataProviders from './MetadataProviders'
import React from 'react'
import { mount } from 'enzyme'

describe('MetadataProviders', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <MetadataProviders
        data={[]}
        onChange={jest.fn()}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
