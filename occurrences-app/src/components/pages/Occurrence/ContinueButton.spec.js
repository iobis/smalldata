import ContinueButton from './ContinueButton'
import React from 'react'
import { mount } from 'enzyme'

describe('ContinueButton', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('renders a given value correctly', () => {
    const wrapper = mount(createComponent({ value: 'Go to next page' }))
    expect(wrapper.find('button').text()).toBe('occurrenceForm.stepContinueGo to next page')
  })

  it('applies given CSS classes to wrapper correctly', () => {
    const wrapper = mount(createComponent({ wrapperClassName: 'my-own-class' }))
    expect(wrapper.find('div').at(0).hasClass('my-own-class')).toBe(true)
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
    name:             'continue',
    onClick:          jest.fn(),
    value:            'Continue',
    wrapperClassName: 'columns'
  }
  return <ContinueButton {...defaultProps} {...props}/>
}
