import ScientificNameInput from './ScientificNameInput'
import React from 'react'
import { mount } from 'enzyme'

describe('ScientificNameInput', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })
})

function createComponent(props) {
  const defaultProps = {
    scientificName: '',
    onChange:       jest.fn()
  }
  return <ScientificNameInput {...defaultProps} {...props}/>
}
