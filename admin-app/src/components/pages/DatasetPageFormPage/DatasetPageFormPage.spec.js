import DatasetPageFormPage from './DatasetPageFormPage'
import React from 'react'
import { mount } from 'enzyme'

describe('DatasetPageFormPage', () => {
  it('renders correctly', () => {
    const wrapper = mount(<DatasetPageFormPage/>)
    expect(wrapper).toMatchSnapshot()

    addBasicData(wrapper)
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-2 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(0).text())
      .toEqual('dataset title')
    expect(wrapper.find('.contact-row')).toHaveLength(0)

    addResourceContacts(wrapper, 1)
    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(1).text())
      .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":1}')

    wrapper.find('.step-2 .step-header').simulate('click')
    expect(wrapper.find('.contact-row')).toHaveLength(1)

    addResourceContacts(wrapper, 2)
    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(1).text())
      .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":2}')
  })

  function addBasicData(wrapper) {
    wrapper.find('.basic-information .title input')
      .simulate('change', { target: { value: 'dataset title' } })
    wrapper.find('.basic-information .publishing-organisation input')
      .simulate('change', { target: { value: 'dataset publishing organisation' } })
    wrapper.find('.basic-information .licence .dropdown').simulate('click')
    wrapper.find('.basic-information .licence .dropdown .dropdown-item').at(1).simulate('click')
    wrapper.find('.basic-information .language .dropdown').simulate('click')
    wrapper.find('.basic-information .language .dropdown .dropdown-item').at(1).simulate('click')
    wrapper.find('.basic-information .abstract textarea')
      .simulate('change', { target: { value: 'dataset abstract information' } })
  }

  function addResourceContacts(wrapper, id) {
    wrapper.find('.name input').simulate('change', { target: { value: 'name-' + id } })
    wrapper.find('.email input').simulate('change', { target: { value: 'email-' + id } })
    wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-' + id } })
    wrapper.find('.position input').simulate('change', { target: { value: 'position-' + id } })
    wrapper.find('.add').simulate('click')
  }
})
