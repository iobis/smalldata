import ResourceContacts from './ResourceContacts'
import React from 'react'
import { mount } from 'enzyme'

describe('ResourceContacts', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <ResourceContacts
        data={[]}
        onChange={jest.fn()}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
