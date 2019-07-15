import ContinueButton from './ContinueButton'
import React from 'react'
import { mount } from 'enzyme'

describe('ContinueButton', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('renders a given value correctly', () => {
    const wrapper = mount(createComponent({ value: 'Go to next page' }))
    expect(wrapper.find('button').text()).toBe('common.continueTo go to next page')
  })

  it('calls onClick handler', () => {
    const onClick = jest.fn()
    const wrapper = mount(createComponent({ onClick: onClick }))
    wrapper.find('button').at(0).simulate('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

function createComponent(props) {
  const defaultProps = {
    name:    'continue',
    onClick: jest.fn(),
    value:   'Continue'
  }
  return <ContinueButton {...defaultProps} {...props}/>
}
