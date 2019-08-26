import DatasetPageFormPage from './DatasetPageFormPage'
import React from 'react'
import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { act } from 'react-dom/test-utils'
import { getDatasetsFixture } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

jest.mock('@smalldata/dwca-lib/src/clients/SmalldataClient', () => ({
  getDatasets:   jest.fn(),
  createDataset: jest.fn(),
  updateDataset: jest.fn()
}))

describe('DatasetPageFormPage', () => {
  let wrapper

  describe('when creating new dataset', () => {
    it('renders correctly', () => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/manage-dataset/create', key: 'testKey' }]}>
          <DatasetPageFormPage/>
        </MemoryRouter>
      )
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

    describe('and then clicking submit button', () => {
      beforeAll(async() => {
        SmalldataClient.createDataset.mockImplementation(() =>
          new Promise((resolve) => {
            resolve({})
          })
        )
        await act(async() => {
          wrapper.find('.submit-entry-button button').at(0).simulate('click')
        })
        wrapper.update()
      })

      it('calls SmalldataClient.createDataset once with correct dataset id', () => {
        expect(SmalldataClient.createDataset).toHaveBeenCalledTimes(1)
        expect(SmalldataClient.createDataset).toHaveBeenNthCalledWith(1, expect.objectContaining({
          basicInformation: expect.objectContaining({
            language: expect.stringMatching('Dutch')
          })
        }))
      })

      it('render success message', () => {
        expect(wrapper.find('.success-message').exists()).toBe(true)
      })

      it('render success message with update title', () => {
        expect(wrapper.find('.success-message .title').text()).toBe('datasetPageFormPage.finalSummary.successMessage.header.create')
      })

      it('does not render error message', () => {
        expect(wrapper.find('.error-message').exists()).toBe(false)
      })
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
          <MemoryRouter initialEntries={[{ pathname: '/manage-dataset/update/C67oYYa_RGgCVD4', key: 'testKey' }]}>
            <DatasetPageFormPage location={location}/>
          </MemoryRouter>
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

      it('renders dataset title on for previous step', () => {
        expect(wrapper.find('.step-header .selected-data').at(0).text()).toEqual('Benthic data from Sevastopol (Black Sea)')
      })

      it('renders resource contacts', () => {
        expect(wrapper.find('.resource-contacts').exists()).toBe(true)
      })

      it('renders correct header of resource contacts', () => {
        const contactsTableHeader = wrapper.find('.resource-contacts .contacts-table-header')
        expect(contactsTableHeader.exists()).toBe(true)
        expect(contactsTableHeader.text()).toBe('datasetPageFormPage.resourceContacts.contactsTableHeader')
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

        it('renders resource creators', () => {
          expect(wrapper.find('.resource-creators').exists()).toBe(true)
        })

        it('renders correct header of resource creators', () => {
          const contactsTableHeader = wrapper.find('.resource-creators .contacts-table-header')
          expect(contactsTableHeader.exists()).toBe(true)
          expect(contactsTableHeader.text()).toBe('datasetPageFormPage.resourceCreators.contactsTableHeader')
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

          it('renders metadata providers', () => {
            expect(wrapper.find('.metadata-providers').exists()).toBe(true)
          })

          it('renders correct header of metadata providers', () => {
            const contactsTableHeader = wrapper.find('.metadata-providers .contacts-table-header')
            expect(contactsTableHeader.exists()).toBe(true)
            expect(contactsTableHeader.text()).toBe('datasetPageFormPage.metadataProviders.contactsTableHeader')
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

            it('renders 4 keywords', () => {
              expect(wrapper.find('.keywords .tag')).toHaveLength(4)
            })

            describe('and then clicking "Review and Submit" button', () => {
              beforeAll(() => {
                wrapper.find('.review-and-submit-button').simulate('click')
              })

              it('renders correctly', () => {
                expect(wrapper.find('.final-summary').exists()).toBe(true)
                expect(wrapper).toMatchSnapshot()
              })

              it('does not render success message', () => {
                expect(wrapper.find('.success-message').exists()).toBe(false)
              })

              it('does not render error message', () => {
                expect(wrapper.find('.error-message').exists()).toBe(false)
              })

              it('render 2 submit entry buttons error message', () => {
                expect(wrapper.find('.submit-entry-button button')).toHaveLength(2)
              })

              describe('and then clicking submit', () => {
                beforeAll(async() => {
                  SmalldataClient.updateDataset.mockImplementation(() =>
                    new Promise((resolve) => {
                      resolve({})
                    })
                  )
                  await act(async() => {
                    wrapper.find('.submit-entry-button button').at(0).simulate('click')
                  })
                  wrapper.update()
                })

                it('calls SmalldataClient.updateDataset once with correct dataset id', () => {
                  expect(SmalldataClient.updateDataset).toHaveBeenCalledTimes(1)
                  expect(SmalldataClient.updateDataset).toHaveBeenNthCalledWith(
                    1,
                    expect.objectContaining({
                      basicInformation: expect.objectContaining({
                        language: expect.stringMatching('English')
                      })
                    }),
                    'NnqVLwIyPn-nRkc')
                })

                it('render success message', () => {
                  expect(wrapper.find('.success-message').exists()).toBe(true)
                })

                it('render success message with update title', () => {
                  expect(wrapper.find('.success-message .title').text()).toBe('datasetPageFormPage.finalSummary.successMessage.header.update')
                })

                it('does not render error message', () => {
                  expect(wrapper.find('.error-message').exists()).toBe(false)
                })
              })
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
  wrapper.find('.resource-contacts .ocean-expert-name-input .input').simulate('change', { target: { value: 'resource-contact-name-' + id } })
  wrapper.find('.resource-contacts .email input').simulate('change', { target: { value: 'resource-contact-email-' + id } })
  wrapper.find('.resource-contacts .organisation input').simulate('change', { target: { value: 'resource-contact-organisation-' + id } })
  wrapper.find('.resource-contacts .add').simulate('click')
}

function addResourceCreator(wrapper, id) {
  wrapper.find('.resource-creators .ocean-expert-name-input .input').simulate('change', { target: { value: 'resource-creator-name-' + id } })
  wrapper.find('.resource-creators .email input').simulate('change', { target: { value: 'resource-creator-email-' + id } })
  wrapper.find('.resource-creators .organisation input').simulate('change', { target: { value: 'resource-creator-organisation-' + id } })
  wrapper.find('.resource-creators .add').simulate('click')
}

function addMetadataProvider(wrapper, id) {
  wrapper.find('.metadata-providers .ocean-expert-name-input .input').simulate('change', { target: { value: 'metadata-provider-name-' + id } })
  wrapper.find('.metadata-providers .email input').simulate('change', { target: { value: 'metadata-provider-email-' + id } })
  wrapper.find('.metadata-providers .organisation input').simulate('change', { target: { value: 'metadata-provider-organisation-' + id } })
  wrapper.find('.metadata-providers .add').simulate('click')
}
