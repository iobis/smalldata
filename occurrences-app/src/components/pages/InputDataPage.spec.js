import InputDataPage from './InputDataPage'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { getDatasetDefaultResponse, OCCURRENCES_RESPONSE } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { AuthProvider } from '@smalldata/dwca-lib'

describe('InputDataPage', () => {
  const originalError = console.error
  let wrapper

  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return
      originalError.call(console, ...args)
    }
  })

  afterAll(() => {
    console.error = originalError
  })

  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        new Promise((resolve) => {
          resolve({ json: () => OCCURRENCES_RESPONSE })
        })
      )
      .mockImplementationOnce(() =>
        new Promise((resolve) => {
          resolve({ json: () => getDatasetDefaultResponse() })
        })
      )
  })

  afterEach(() => {
    global.fetch.mockRestore()
  })

  it('renders correctly', async() => {
    act(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/input-data', key: 'testKey' }]}>
          <AuthProvider>
            <InputDataPage/>
          </AuthProvider>
        </MemoryRouter>
      )
    })

    expect(wrapper.find('tbody tr')).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/dwca/user/ovZTtaOJZ98xDDY/records?projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate')
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/datasets', { headers: { Authorization: 'Basic verysecret' } })

    await flushPromises()
    wrapper.update()
    expect(wrapper.find('tbody tr')).toHaveLength(3)
    expect(wrapper).toMatchSnapshot()
  })
})

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}
