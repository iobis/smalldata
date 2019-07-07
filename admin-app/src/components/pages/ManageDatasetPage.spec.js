import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { flushPromises, ignoreActWarning } from '@smalldata/test-utils-lib'
import ManageDatasetPage from './ManageDatasetPage'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

jest.mock('@smalldata/dwca-lib/src/clients/SmalldataClient', () => ({
  getDatasets: jest.fn().mockImplementation(() =>
    new Promise((resolve) => {
      resolve([{
        id:                'id-1',
        license:           {
          title: 'title-1'
        },
        metadataProviders: [{
          organizationName: 'Flanders Marine Institute (VLIZ)'
        }],
        title:             {
          value: 'with organization name in metadata'
        }
      }, {
        id:                'id-2',
        license:           {
          title: 'title-2'
        },
        metadataProviders: [{}],
        title:             {
          value: 'without organization name in metadata'
        }
      }])
    })
  )
}))

describe('ManageDatasetPage', () => {
  ignoreActWarning()

  let wrapper

  it('renders correctly for non empty datasets', async() => {
    act(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/manage-dataset', key: 'testKey' }]}>
          <ManageDatasetPage/>
        </MemoryRouter>
      )
    })
    expect(SmalldataClient.getDatasets).toHaveBeenCalledWith()

    await flushPromises()
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('tbody tr')).toHaveLength(2)
  })
})
