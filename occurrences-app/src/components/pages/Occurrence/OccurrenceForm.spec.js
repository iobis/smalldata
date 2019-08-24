import OccurrenceForm from './OccurrenceForm'
import React from 'react'
import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { act } from 'react-dom/test-utils'
import { AuthProvider } from '@smalldata/dwca-lib'
import { getDatasetsFixture, getDefaultDwcaResponse } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

jest.mock('@smalldata/dwca-lib/src/clients/SmalldataClient', () => ({
  createOccurrence: jest.fn(),
  getDatasets:      jest.fn(),
  getOccurrence:    jest.fn(),
  updateOccurrence: jest.fn()
}))

describe('OccurrenceForm', () => {
  let wrapper

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2019, 3, 29)).valueOf())
  })

  afterAll(() => {
    jest.spyOn(Date, 'now').mockRestore()
  })

  describe('when creating new occurrence', () => {
    beforeAll(async() => {
      SmalldataClient.getDatasets.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(getDatasetsFixture())
        })
      )
      await act(async() => {
        wrapper = mount(
          <AuthProvider>
            <MemoryRouter initialEntries={[{ pathname: '/input-data/create', key: 'testKey' }]}>
              <OccurrenceForm/>
            </MemoryRouter>
          </AuthProvider>
        )
      })
      wrapper.update()
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it('calls SmalldataClient.getDatasets once once without any args', () => {
      expect(SmalldataClient.getDatasets).toHaveBeenCalledTimes(1)
      expect(SmalldataClient.getDatasets).toHaveBeenNthCalledWith(1)
    })

    it('renders renders datasets', () => {
      expect(wrapper.find('.dataset').exists()).toBe(true)
      expect(wrapper.find('.dataset-option')).toHaveLength(4)
    })

    it('renders correctly', async() => {
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()

      addLocation(wrapper)
      wrapper.find('.step-4 .step-header').simulate('click')
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()

      addObservationData(wrapper)
      wrapper.find('.step-5 .step-header').simulate('click')
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()

      addMeasurement(wrapper, '10')
      wrapper.find('.step-6 .step-header').simulate('click')
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()

      addMeasurement(wrapper, '20')
      wrapper.find('.step-6 .step-header').simulate('click')
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()

      addMeasurement(wrapper, '20')
      wrapper.find('.step-6 .step-header').simulate('click')
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()

      expect(wrapper.find('.fieldrow')).toHaveLength(0)
      addDarwinCoreField(wrapper, 'name-1', 'value-1')
      expect(wrapper.find('.fieldrow')).toHaveLength(1)

      addDarwinCoreField(wrapper, 'name-2', 'value-2')
      expect(wrapper.find('.fieldrow')).toHaveLength(2)

      addDarwinCoreField(wrapper, 'name-3', 'value-3')
      expect(wrapper.find('.fieldrow')).toHaveLength(3)

      removeDarwinCoreField(wrapper, 1)
      expect(wrapper.find('.fieldrow')).toHaveLength(2)
    })

    describe('and then clicking "Review and Submit" button', () => {
      beforeAll(() => {
        wrapper.find('.review-and-submit-button').simulate('click')
      })

      it('renders correctly', () => {
        expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()
        expect(wrapper.find('.final-summary').exists()).toBe(true)
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

      describe('and then clicking submit button', () => {
        beforeAll(async() => {
          SmalldataClient.createOccurrence.mockImplementation(() =>
            new Promise((resolve) => {
              resolve({})
            })
          )
          await act(async() => {
            wrapper.find('.submit-entry-button button').at(0).simulate('click')
          })
          wrapper.update()
        })

        it('calls SmalldataClient.createOccurrence once with correct dataset id', () => {
          expect(SmalldataClient.createOccurrence).toHaveBeenCalledTimes(1)
          expect(SmalldataClient.createOccurrence).toHaveBeenNthCalledWith(1, expect.any(Object))
        })

        it('render success message', () => {
          expect(wrapper.find('.success-message').exists()).toBe(true)
        })

        it('render success message with update title', () => {
          expect(wrapper.find('.success-message .title').text()).toBe('occurrenceForm.finalSummary.successMessage.header.create')
        })

        it('does not render error message', () => {
          expect(wrapper.find('.error-message').exists()).toBe(false)
        })
      })
    })
  })

  describe('when updating occurrence', () => {
    beforeAll(async() => {
      SmalldataClient.getOccurrence.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(getDefaultDwcaResponse())
        })
      )
      const location = {
        state: {
          action:    'update',
          datasetId: 'ntDOtUc7XsRrIus',
          dwcaId:    'IBSS_R/V N. Danilevskiy 1935 Azov Sea benthos data_796'
        }
      }
      await act(async() => {
        wrapper = mount(
          <AuthProvider>
            <MemoryRouter initialEntries={[{ pathname: '/input-data/update', key: 'testKey' }]}>
              <OccurrenceForm location={location}/>
            </MemoryRouter>
          </AuthProvider>
        )
      })
      wrapper.update()
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it('calls SmalldataClient.getOccurrence once', () => {
      expect(SmalldataClient.getOccurrence).toHaveBeenCalledWith({
        datasetId: 'ntDOtUc7XsRrIus',
        dwcaId:    'IBSS_R/V N. Danilevskiy 1935 Azov Sea benthos data_796',
        userRef:   'ovZTtaOJZ98xDDY'
      })
    })

    it('calls SmalldataClient.getDatasets two times without any args', () => {
      expect(SmalldataClient.getDatasets).toHaveBeenCalledTimes(2)
    })

    it('renders correctly', () => {
      expect(wrapper.find(OccurrenceForm)).toMatchSnapshot()
    })

    it('renders datasets', () => {
      expect(wrapper.find('.dataset').exists()).toBe(true)
      expect(wrapper.find('.dataset-option')).toHaveLength(4)
    })
  })
})

function addLocation(wrapper) {
  wrapper.find('.step-3 .step-header').simulate('click')
  wrapper.find('.decimal-latitude input').simulate('change', { target: { value: '0.12345' } })
  wrapper.find('.decimal-longitude input').simulate('change', { target: { value: '-0.54321' } })
}

function addObservationData(wrapper) {
  wrapper.find('.step-4 .step-header').simulate('click')
  wrapper.find('.identified-by input').simulate('change', { target: { value: 'Indiana Jones' } })
  wrapper.find('.institution-code input').simulate('change', { target: { value: 'institution code' } })
  wrapper.find('.identified-by input').simulate('keydown', { key: 'Enter' })
}

function addMeasurement(wrapper, value) {
  wrapper.find('.step-5 .step-header').simulate('click')
  wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: value } })
  wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
}

function addDarwinCoreField(wrapper, name, value) {
  wrapper.find('.darwin-core-fields .field-name input').simulate('change', { target: { value: name } })
  wrapper.find('.darwin-core-fields .value input').simulate('change', { target: { value: value } })
  wrapper.find('.darwin-core-fields .add .button').simulate('click')
}

function removeDarwinCoreField(wrapper, index) {
  wrapper.find('.darwin-core-fields .remove').at(index).simulate('click')
}
