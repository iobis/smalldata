import React from 'react'
import DarwinCoreFields from './DarwinCoreFields'
import { mount } from 'enzyme/build'

describe('DarwinCoreFields', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('adds element when clicking add button', () => {
    const wrapper = mount(createComponent())

    expect(wrapper.find('.fieldrow')).toHaveLength(4)

    wrapper.find('.field-name input').simulate('change', { target: { value: 'new text value' } })
    wrapper.find('.value input').simulate('change', { target: { value: 'new text value' } })

    wrapper.find('.add .button').simulate('click')
    expect(wrapper.find('.fieldrow')).toHaveLength(5)

  })

  it('removes element when clicking remove button',()=> {
    const wrapper = mount(createComponent())

    wrapper.find('.remove').first().simulate('click')
    expect(wrapper.find('.fieldrow')).toHaveLength(3)
  })
})

function createComponent() {
  return (
    <DarwinCoreFields
      onChange={jest.fn()}/>
  )
}
