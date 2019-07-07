import React from 'react'
import DarwinCoreFields from './DarwinCoreFields'
import { mount } from 'enzyme'
import { getDefaultFields } from './DarwinCoreFields.fixture'

describe('DarwinCoreFields', () => {
  let wrapper

  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('adds element when clicking add button', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    expect(wrapper.find('.fieldrow')).toHaveLength(3)

    wrapper.find('.field-name input').simulate('change', { target: { value: 'new name' } })
    wrapper.find('.value input').simulate('change', { target: { value: 'new value' } })
    wrapper.find('.add .button').simulate('click')
    expect(wrapper.find('.fieldrow')).toHaveLength(4)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith([
      ...getDefaultFields(),
      { 'name': 'new name', 'value': 'new value' }
    ])
  })

  it('removes element when clicking remove button', () => {
    const onChange = jest.fn()
    wrapper = mount(createComponent({ onChange }))

    wrapper.find('.remove').first().simulate('click')
    expect(wrapper.find('.fieldrow')).toHaveLength(2)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith([getDefaultFields()[1], getDefaultFields()[2]])
  })

  it('updates values when updates props', () => {
    wrapper = mount(createComponent({ fields: [] }))
    expect(wrapper.find('.fieldrow')).toHaveLength(0)

    wrapper.setProps({ fields: getDefaultFields() })
    wrapper.update()
    expect(wrapper.find('.fieldrow')).toHaveLength(3)
  })
})

function createComponent(props) {
  const defaultProps = {
    fields:   getDefaultFields(),
    onChange: jest.fn()
  }

  return <DarwinCoreFields {...defaultProps} {...props}/>
}
