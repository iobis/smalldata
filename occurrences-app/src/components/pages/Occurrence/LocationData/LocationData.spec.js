import LocationData from './LocationData'
import React from 'react'
import { getEmptyData } from './LocationData.fixture'
import { mount } from 'enzyme'

jest.mock('./LocationPicker', () => () => (
  <div id="location-picker-mock">
    LocationPickerMock
  </div>
))

describe('LocationData', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('returns updated data when changing decimal-longitude', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    wrapper.find('.decimal-longitude input').simulate('change', { target: { value: '0.12345' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith({
      beginDate:             new Date('2019-01-02T12:30:40+00:00'),
      endDate:               new Date('2020-01-02T12:30:40+00:00'),
      coordinateUncertainty: null,
      decimalLatitude:       null,
      decimalLongitude:      0.12345,
      maximumDepth:          null,
      minimumDepth:          null,
      verbatimCoordinates:   '',
      verbatimDepth:         ''
    })
  })

  it('returns updated data when changing decimal-latitude', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    wrapper.find('.decimal-longitude input').simulate('change', { target: { value: '-0.12345' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith({
      beginDate:             new Date('2019-01-02T12:30:40+00:00'),
      endDate:               new Date('2020-01-02T12:30:40+00:00'),
      coordinateUncertainty: null,
      decimalLatitude:       null,
      decimalLongitude:      -0.12345,
      maximumDepth:          null,
      minimumDepth:          null,
      verbatimCoordinates:   '',
      verbatimDepth:         ''
    })
  })
})

function createComponent(props) {
  const defaultProps = {
    data:     getEmptyData(),
    onChange: jest.fn()
  }
  return <LocationData {...defaultProps} {...props}/>
}
