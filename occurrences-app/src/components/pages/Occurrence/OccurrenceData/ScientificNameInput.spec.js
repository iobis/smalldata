import ScientificNameInput from './ScientificNameInput'
import React from 'react'
import { mount } from 'enzyme'

describe('ScientificNameInput', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('updates values when updates props', () => {
    const wrapper = mount(createComponent({ scientificName: 'name-1' }))
    expect(wrapper.find('input').props().value).toBe('name-1')

    wrapper.setProps({ scientificName: 'name-100500' })
    wrapper.update()
    expect(wrapper.find('input').props().value).toBe('name-100500')
  })
})

function createComponent(props) {
  const defaultProps = {
    scientificName: '',
    onChange:       jest.fn()
  }
  return <ScientificNameInput {...defaultProps} {...props}/>
}
