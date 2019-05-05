import React from 'react'
import renderer from 'react-test-renderer'
import ObservationData from './ObservationData'
import { mount } from 'enzyme/build'

describe('ObservationData', () => {
  it('renders correctly', () => {
    expect(renderer.create(createComponent()).toJSON()).toMatchSnapshot()
  })

  it('returns updated data when changing institution-code', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    wrapper.find('.institution-code input').simulate('change', { target: { value: 'institution code' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith({
      catalogNumber:           '',
      collectionCode:          '',
      fieldNumber:             '',
      identificationQualifier: '',
      identificationRemarks:   '',
      identifiedBy:            ['name 1', 'name 2'],
      institutionCode:         'institution code',
      recordNumber:            '',
      recordedBy:              ['name 1', 'name 2', 'name 3'],
      references:              ['https://google.com', 'https://gmail.com']
    })
  })

  it('returns updated data when adding identified-by name', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    wrapper.find('.identified-by input').simulate('change', { target: { value: 'new name' } })
    wrapper.find('.identified-by input').simulate('keydown', { key: 'Enter' })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith({
      catalogNumber:           '',
      collectionCode:          '',
      fieldNumber:             '',
      identificationQualifier: '',
      identificationRemarks:   '',
      identifiedBy:            ['name 1', 'name 2', 'new name'],
      institutionCode:         '',
      recordNumber:            '',
      recordedBy:              ['name 1', 'name 2', 'name 3'],
      references:              ['https://google.com', 'https://gmail.com']
    })
  })
})

function createComponent(props) {
  const observationData = {
    institutionCode:         '',
    collectionCode:          '',
    fieldNumber:             '',
    catalogNumber:           '',
    recordNumber:            '',
    identifiedBy:            ['name 1', 'name 2'],
    recordedBy:              ['name 1', 'name 2', 'name 3'],
    identificationQualifier: '',
    identificationRemarks:   '',
    references:              ['https://google.com', 'https://gmail.com']
  }
  const defaultProps = {
    observationData,
    onChange: jest.fn()
  }
  return <ObservationData {...defaultProps} {...props}/>
}
