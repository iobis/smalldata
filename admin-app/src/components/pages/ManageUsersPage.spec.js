import ManageUsersPage from './ManageUsersPage'
import React from 'react'
import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

jest.mock('@smalldata/dwca-lib/src/clients/SmalldataClient', () => ({
  getUsersWithDatasets: jest.fn().mockImplementation(() =>
    new Promise((resolve) => {
      resolve([{
        _id:          'user-1-id',
        id:           'user-1-ref',
        emailAddress: 'email-1@domain.com',
        datasets:     [{
          id:    'dataset-1-id',
          title: { value: 'dataset-1-title' }
        }]
      }, {
        _id:          'user-2-id',
        id:           'user-2-ref',
        role:         'node manager',
        emailAddress: 'email-2@domain.com',
        datasets:     [{
          id:    'dataset-1-id',
          title: { value: 'dataset-1-title' }
        }]
      }])
    })
  )
}))

describe('ManageUsersPage', () => {
  let wrapper

  describe('when users provided', () => {
    beforeAll(async() => {
      await act(async() => {
        wrapper = mount(
          <MemoryRouter initialEntries={[{ pathname: '/manage-users', key: 'testKey' }]}>
            <ManageUsersPage/>
          </MemoryRouter>
        )
      })
      wrapper.update()
    })

    it('calls SmalldataClient.getUsersWithDatasets without any args', () => {
      expect(SmalldataClient.getUsersWithDatasets).toHaveBeenCalledTimes(1)
      expect(SmalldataClient.getUsersWithDatasets).toHaveBeenCalledWith()
    })

    it('renders correctly', () => {
      expect(wrapper.find(ManageUsersPage)).toMatchSnapshot()
    })

    it('renders 2 users', () => {
      expect(wrapper.find('tbody tr')).toHaveLength(2)
    })
  })
})
