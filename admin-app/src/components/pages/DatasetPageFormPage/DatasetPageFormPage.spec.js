import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import DatasetPageFormPage from './DatasetPageFormPage'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { getDatasetsFixture } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'

jest.mock('@smalldata/dwca-lib/src/clients/SmalldataClient', () => ({
  getDatasets: jest.fn()
}))

describe('DatasetPageFormPage', () => {
  let wrapper

  describe('when creating new dataset', () => {
    it('renders correctly', () => {
      wrapper = mount(<DatasetPageFormPage/>)
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
  })

  describe('when updating dataset', () => {
    beforeAll(async() => {
      SmalldataClient.getDatasets.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(getDatasetsFixture())
        })
      )

      const location = {
        state: {
          action: 'update',
          id:     'NnqVLwIyPn-nRkc'
        }
      }
      await act(async() => {
        wrapper = mount(
          <DatasetPageFormPage location={location}/>
        )
      })
      wrapper.update()
    })

    it('calls SmalldataClient.getDatasets once without any args', () => {
      expect(SmalldataClient.getDatasets).toHaveBeenCalledWith()
    })

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('renders basic information of selected dataset', () => {
      expect(wrapper.find('.basic-information .title input').props().value).toEqual('Benthic data from Sevastopol (Black Sea)')
      expect(wrapper.find('.basic-information .licence .selected-value').text()).toEqual('Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License')
      expect(wrapper.find('.basic-information .language .selected-value').text()).toEqual('English')
      expect(wrapper.find('.basic-information .abstract textarea').text()).toEqual('paragraph-1\n\nparagraph-2')
    })

    describe('and then clicking on resource contacts', () => {
      beforeAll(() => {
        wrapper.find('.step-2 .step-header').simulate('click')
      })

      it('renders title dataset title on for previous step', () => {
        expect(wrapper.find('.step-header .selected-data').at(0).text()).toEqual('Benthic data from Sevastopol (Black Sea)')
      })

      it('renders 1 contact row', () => {
        expect(wrapper.find('.resource-contacts .contact-row')).toHaveLength(1)
      })

      describe('and then clicking on resource creators', () => {
        beforeAll(() => {
          wrapper.find('.step-3 .step-header').simulate('click')
        })

        it('renders resource contacts title with 1 nr of contacts', () => {
          expect(wrapper.find('.step-header .selected-data').at(1).text())
            .toEqual('datasetPageFormPage.resourceContacts.step.selectedData {"nrOfContacts":1}')
        })

        it('renders 3 resource creators', () => {
          expect(wrapper.find('.resource-creators .contact-row')).toHaveLength(3)
        })

        describe('and then clicking on metadata providers', () => {
          beforeAll(() => {
            wrapper.find('.step-4 .step-header').simulate('click')
          })

          it('renders resource creators title with 3 nr of contacts', () => {
            expect(wrapper.find('.step-header .selected-data').at(2).text())
              .toEqual('datasetPageFormPage.resourceCreators.step.selectedData {"nrOfContacts":3}')
          })

          it('renders 1 metadata provider', () => {
            expect(wrapper.find('.metadata-providers .contact-row')).toHaveLength(1)
          })

          describe('and then clicking on keywords', () => {
            beforeAll(() => {
              wrapper.find('.step-5 .step-header').simulate('click')
            })

            it('renders metadata provider title with 1 nr of contacts', () => {
              expect(wrapper.find('.step-header .selected-data').at(3).text())
                .toEqual('datasetPageFormPage.metadataProviders.step.selectedData {"nrOfContacts":1}')
            })

            it('renders 6 keywords', () => {
              expect(wrapper.find('.keywords .tag')).toHaveLength(6)
            })
          })
        })
      })
    })
  })
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
  wrapper.find('.resource-contacts .add').simulate('click')
}

function addResourceCreator(wrapper, id) {
  wrapper.find('.resource-creators .name input').simulate('change', { target: { value: 'resource-creator-name-' + id } })
  wrapper.find('.resource-creators .email input').simulate('change', { target: { value: 'resource-creator-email-' + id } })
  wrapper.find('.resource-creators .organisation input').simulate('change', { target: { value: 'resource-creator-organisation-' + id } })
  wrapper.find('.resource-creators .add').simulate('click')
}

function addMetadataProvider(wrapper, id) {
  wrapper.find('.metadata-providers .name input').simulate('change', { target: { value: 'metadata-provider-name-' + id } })
  wrapper.find('.metadata-providers .email input').simulate('change', { target: { value: 'metadata-provider-email-' + id } })
  wrapper.find('.metadata-providers .organisation input').simulate('change', { target: { value: 'metadata-provider-organisation-' + id } })
  wrapper.find('.metadata-providers .add').simulate('click')
}
