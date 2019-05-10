import React from 'react'
import ReactDOM from 'react-dom'
import LocationPicker from './LocationPicker'

describe('LocationPicker', () => {
  it('renders correctly', () => {
    const container = document.createElement('div')
    ReactDOM.render(createComponent(), container)
    expect(container).toMatchSnapshot()
    ReactDOM.unmountComponentAtNode(container)
  })
})

function createComponent() {
  return <LocationPicker/>
}
