import InputDataPage from './InputDataPage'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { getDatasetDefaultResponse, OCCURRENCES_RESPONSE } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { AuthContext } from '@smalldata/dwca-lib'

describe('InputDataPage', () => {
  let wrapper

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
    await act(async() => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/input-data', key: 'testKey' }]}>
          <AuthContext.Provider
            value={{ userRef: 'ovZTtaOJZ98xDDY', loggedIn: true }}>
            <InputDataPage/>
          </AuthContext.Provider>
        </MemoryRouter>
      )
    })

    expect(wrapper.find('.rt-table .rt-tr-group')).toHaveLength(10)
    expect(wrapper.find('.rt-table .rt-tr-group div.added-at').map(el => el.text()))
      .toEqual([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    expect(wrapper).toMatchSnapshot()
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/dwca/user/ovZTtaOJZ98xDDY/records?projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/datasets', {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    wrapper.update()
    expect(wrapper.find('.rt-table .rt-tr-group')).toHaveLength(10)
    expect(wrapper.find('.rt-table .rt-tr-group div.added-at').map(el => el.text()))
      .toEqual(['20 June 2019', '—', '—', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    expect(wrapper).toMatchSnapshot()
  })
})
