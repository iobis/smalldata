import ContinueButton from './ContinueButton'
import React from 'react'
import { mount } from 'enzyme'

describe('ContinueButton', () => {
  it('renders correctly', () => {
    expect(mount(createCompontent())).toMatchSnapshot()
  })

  it('renders a given value correctly', () => {
    const wrapper = mount(createCompontent({ value: 'Go to next page' }))
    expect(wrapper.find('button').text()).toBe('Go to next page')
  })

})

function createCompontent(props) {
  const defaultProps = {
    name:    'continue',
    onClick: jest.fn(),
    value:   'Continue'
  }
  return <ContinueButton {...defaultProps} {...props}/>
}
