import React from 'react'
import DarwinCoreFields from './DarwinCoreFields'
import { mount } from 'enzyme'

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

  it('removes element when clicking remove button', () => {
    const wrapper = mount(createComponent())

    wrapper.find('.remove').first().simulate('click')
    expect(wrapper.find('.fieldrow')).toHaveLength(3)
  })
})

function createComponent(props) {
  const defaultProps = {
    fields:   [
      { name: 'dummy field', value: 'dummy value' },
      { name: 'dummy2 field', value: 'dummy value' },
      { name: 'dummy3 field', value: 'dummy value' },
      { name: 'dummy4 field', value: 'dummy value' }
    ],
    onChange: jest.fn()
  }

  return <DarwinCoreFields {...defaultProps} {...props}/>
}
