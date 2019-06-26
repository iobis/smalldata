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

  it('applies given CSS classes to wrapper correctly', () => {
    const wrapper = mount(createCompontent({ wrapperClassName: 'my-own-class' }))
    expect(wrapper.find('div').at(0).hasClass('my-own-class')).toBe(true)
  })

  it('calls nextStepHandler', () => {
    const nextStepHandler = jest.fn()
    const wrapper = mount(createCompontent({ nextStepHandler: nextStepHandler }))
    wrapper.find('button').at(0).simulate('click')

    expect(nextStepHandler).toHaveBeenCalledTimes(1)
  })
})

function createCompontent(props) {
  const defaultProps = {
    name:             'continue',
    nextStepHandler:  jest.fn(),
    value:            'Continue',
    wrapperClassName: 'columns'
  }
  return <ContinueButton {...defaultProps} {...props}/>
}
