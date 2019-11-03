import InputDataPage from './InputDataPage'
import React from 'react'
import { Link, MemoryRouter } from 'react-router-dom'
import { getDatasetDefaultResponse, OCCURRENCES_RESPONSE } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { AuthContext } from '@smalldata/dwca-lib'

const tableRowCssSelector = '.rt-table .rt-tr-group'

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

    expect(wrapper.find('.-loading.-active').exists()).toBe(true)
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
    expect(wrapper.find('.-loading.-active').exists()).toBe(false)
    expect(wrapper.find(tableRowCssSelector)).toHaveLength(10)
    expect(wrapper.find(tableRowCssSelector + ' div.added-at').map(el => el.text()))
      .toEqual(['20 June 2019', '—', '—', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    expect(wrapper.find(tableRowCssSelector).at(0).find(Link).at(0).props().to.state.action).toBe('update')
    expect(wrapper.find(tableRowCssSelector).at(0).find(Link).at(1).props().to.state.action).toBe('create')
    expect(wrapper).toMatchSnapshot()
  })
})
