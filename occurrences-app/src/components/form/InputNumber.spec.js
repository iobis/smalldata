import InputNumber from './InputNumber'
import React from 'react'
import { mount } from 'enzyme/build'

describe('InputText', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('renders correctly if optional', () => {
    expect(mount(createComponent({ optional: true }))).toMatchSnapshot()
  })

  it('returns integer number when changing value to integer', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))

    wrapper.find('input').simulate('change', { target: { value: '1234' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith(1234)
  })

  it('returns float number when changing value to float', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))

    wrapper.find('input').simulate('change', { target: { value: '1.10' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith(1.10)
  })
})

function createComponent(props) {
  const defaultProps = {
    className: 'custom-class-name',
    name:      'field-name',
    onChange:  jest.fn(),
    value:     'value'
  }
  return <InputNumber {...defaultProps} {...props}/>
}
