import Dropdown from './Dropdown'
import React from 'react'
import { mount } from 'enzyme'

describe('Dropdown', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('returns selected value when changing', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))

    wrapper.find('.dropdown-trigger button').simulate('click')
    expect(wrapper.find('.selected-value').text()).toBe('option-1')
    expect(wrapper.find('.dropdown').hasClass('is-active')).toBe(true)
    expect(wrapper.find('.dropdown-item')).toHaveLength(3)
    expect(onChange).toHaveBeenCalledTimes(0)

    wrapper.find('.dropdown-item').at(1).simulate('click')
    expect(wrapper.find('.selected-value').text()).toBe('option-2')
    expect(wrapper.find('.dropdown').hasClass('is-active')).toBe(false)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith('option-2')
  })

  it('updates selected value when props changing', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))

    wrapper.find('.dropdown-trigger button').simulate('click')
    expect(wrapper.find('.selected-value').text()).toBe('option-1')
    expect(wrapper.find('.dropdown').hasClass('is-active')).toBe(true)
    expect(wrapper.find('.dropdown-item')).toHaveLength(3)
    expect(onChange).toHaveBeenCalledTimes(0)

    wrapper.setProps({ value: 'option-3' })
    expect(wrapper.find('.selected-value').text()).toBe('option-3')
  })
})

function createComponent(props) {
  const defaultProps = {
    options:  ['option-1', 'option-2', 'option-3'],
    onChange: jest.fn(),
    value:    'option-1'
  }
  return <Dropdown {...defaultProps} {...props}/>
}
