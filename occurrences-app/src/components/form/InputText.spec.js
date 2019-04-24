import InputText from './InputText'
import React from 'react'
import { mount } from 'enzyme/build'

describe('InputText', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('returns text value onChange', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))

    wrapper.find('input').simulate('change', {target: {value: 'new text value'}});

    expect(onChange).toBeCalledWith('new text value')
  })
})

function createComponent(props) {
  const defaultProps = {
    className: 'custom-class-name',
    name:      'field-name',
    onChange:  jest.fn(),
    value:     'value'
  }
  return <InputText {...defaultProps} {...props}/>
}
