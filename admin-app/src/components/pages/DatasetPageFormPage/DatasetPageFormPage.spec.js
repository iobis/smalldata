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
    expect(wrapper.find('.resource-contacts .contact-row')).toHaveLength(0)

    addResourceContacts(wrapper, 1)
    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(1).text())
      .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":1}')

    wrapper.find('.step-2 .step-header').simulate('click')
    expect(wrapper.find('.resource-contacts .contact-row')).toHaveLength(1)

    addResourceContacts(wrapper, 2)
    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(1).text())
      .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":2}')
    expect(wrapper.find('.resource-creators .contact-row')).toHaveLength(0)

    addResourceCreators(wrapper, 1)
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(2).text())
      .toEqual('datasetPageFormPage.resourceCreators.step.selectedData {"nrOfContacts":1}')

    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.resource-creators .contact-row')).toHaveLength(1)

    addResourceCreators(wrapper, 2)
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(2).text())
      .toEqual('datasetPageFormPage.resourceCreators.step.selectedData {"nrOfContacts":2}')
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
    wrapper.find('.resource-contacts .name input').simulate('change', { target: { value: 'resource-contacts-name-' + id } })
    wrapper.find('.resource-contacts .email input').simulate('change', { target: { value: 'resource-contacts-email-' + id } })
    wrapper.find('.resource-contacts .organisation input').simulate('change', { target: { value: 'resource-contacts-organisation-' + id } })
    wrapper.find('.resource-contacts .position input').simulate('change', { target: { value: 'resource-contacts-position-' + id } })
    wrapper.find('.resource-contacts .add').simulate('click')
  }

  function addResourceCreators(wrapper, id) {
    wrapper.find('.resource-creators .name input').simulate('change', { target: { value: 'resource-creators-name-' + id } })
    wrapper.find('.resource-creators .email input').simulate('change', { target: { value: 'resource-creators-email-' + id } })
    wrapper.find('.resource-creators .organisation input').simulate('change', { target: { value: 'resource-creators-organisation-' + id } })
    wrapper.find('.resource-creators .position input').simulate('change', { target: { value: 'resource-creators-position-' + id } })
    wrapper.find('.resource-creators .add').simulate('click')
  }
})
