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

    addResourceContact(wrapper, 1)
    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(1).text())
      .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":1}')

    wrapper.find('.step-2 .step-header').simulate('click')
    expect(wrapper.find('.resource-contacts .contact-row')).toHaveLength(1)

    addResourceContact(wrapper, 2)
    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(1).text())
      .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":2}')
    expect(wrapper.find('.resource-creators .contact-row')).toHaveLength(0)

    addResourceCreator(wrapper, 1)
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(2).text())
      .toEqual('datasetPageFormPage.resourceCreators.step.selectedData {"nrOfContacts":1}')

    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper.find('.resource-creators .contact-row')).toHaveLength(1)

    addResourceCreator(wrapper, 2)
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(2).text())
      .toEqual('datasetPageFormPage.resourceCreators.step.selectedData {"nrOfContacts":2}')
    expect(wrapper.find('.metadata-providers .contact-row')).toHaveLength(0)

    addMetadataProvider(wrapper, 1)
    wrapper.find('.step-5 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(3).text())
      .toEqual('datasetPageFormPage.metadataProviders.step.selectedData {"nrOfContacts":1}')

    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper.find('.metadata-providers .contact-row')).toHaveLength(1)

    addMetadataProvider(wrapper, 2)
    wrapper.find('.step-5 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(3).text())
      .toEqual('datasetPageFormPage.metadataProviders.step.selectedData {"nrOfContacts":2}')

    wrapper.find('.keywords input').simulate('change', { target: { value: 'keyword-1' } })
    wrapper.find('.keywords input').simulate('keydown', { key: 'Enter' })
    wrapper.find('.keywords input').simulate('change', { target: { value: 'keyword-2' } })
    wrapper.find('.keywords input').simulate('keydown', { key: 'Enter' })
    expect(wrapper.find('.keywords .tag')).toHaveLength(2)

    wrapper.find('.review-and-submit-button').simulate('click')
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.final-summary').exists()).toBe(true)
    expect(wrapper.find('.success-message').exists()).toBe(false)
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  function addBasicData(wrapper) {
    wrapper.find('.basic-information .title input')
      .simulate('change', { target: { value: 'dataset title' } })
    wrapper.find('.basic-information .licence .dropdown').simulate('click')
    wrapper.find('.basic-information .licence .dropdown .dropdown-item').at(1).simulate('click')
    wrapper.find('.basic-information .language .dropdown').simulate('click')
    wrapper.find('.basic-information .language .dropdown .dropdown-item').at(1).simulate('click')
    wrapper.find('.basic-information .abstract textarea')
      .simulate('change', { target: { value: 'dataset abstract information' } })
  }

  function addResourceContact(wrapper, id) {
    wrapper.find('.resource-contacts .name input').simulate('change', { target: { value: 'resource-contact-name-' + id } })
    wrapper.find('.resource-contacts .email input').simulate('change', { target: { value: 'resource-contact-email-' + id } })
    wrapper.find('.resource-contacts .organisation input').simulate('change', { target: { value: 'resource-contact-organisation-' + id } })
    wrapper.find('.resource-contacts .position input').simulate('change', { target: { value: 'resource-contact-position-' + id } })
    wrapper.find('.resource-contacts .add').simulate('click')
  }

  function addResourceCreator(wrapper, id) {
    wrapper.find('.resource-creators .name input').simulate('change', { target: { value: 'resource-creator-name-' + id } })
    wrapper.find('.resource-creators .email input').simulate('change', { target: { value: 'resource-creator-email-' + id } })
    wrapper.find('.resource-creators .organisation input').simulate('change', { target: { value: 'resource-creator-organisation-' + id } })
    wrapper.find('.resource-creators .position input').simulate('change', { target: { value: 'resource-creator-position-' + id } })
    wrapper.find('.resource-creators .add').simulate('click')
  }

  function addMetadataProvider(wrapper, id) {
    wrapper.find('.metadata-providers .name input').simulate('change', { target: { value: 'metadata-provider-name-' + id } })
    wrapper.find('.metadata-providers .email input').simulate('change', { target: { value: 'metadata-provider-email-' + id } })
    wrapper.find('.metadata-providers .organisation input').simulate('change', { target: { value: 'metadata-provider-organisation-' + id } })
    wrapper.find('.metadata-providers .position input').simulate('change', { target: { value: 'metadata-provider-position-' + id } })
    wrapper.find('.metadata-providers .add').simulate('click')
  }
})
