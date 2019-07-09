import InputRadio from './InputRadio'
import React from 'react'
import { mount } from 'enzyme'

describe('InputRadio', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('returns value when clicking onChange', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))

    wrapper.find('input').first().simulate('change')

    expect(onChange).toBeCalledWith('value')
  })
})

function createComponent(props) {
  const defaultProps = {
    checked:  false,
    text:     'text',
    name:     'name',
    onChange: jest.fn(),
    value:    'value'
  }
  return <InputRadio {...defaultProps} {...props}/>
}