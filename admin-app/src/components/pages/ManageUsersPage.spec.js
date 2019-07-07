import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import ManageUsersPage from './ManageUsersPage'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

jest.mock('@smalldata/dwca-lib/src/clients/SmalldataClient', () => ({
  getUsersWithDatasets: jest.fn().mockImplementation(() =>
    new Promise((resolve) => {
      resolve([{
        _id:          'user-1',
        emailAddress: 'email-1@domain.com',
        datasets:     [{
          id:    'dataset-1-id',
          title: { value: 'dataset-1-title' }
        }]
      }])
    })
  )
}))

describe('ManageUsersPage', () => {
  const originalError = console.error
  let wrapper

  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return
      originalError.call(console, ...args)
    }
  })

  it('renders correctly for empty users', async() => {
    act(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/manage-users', key: 'testKey' }]}>
          <ManageUsersPage/>
        </MemoryRouter>
      )
    })
    expect(SmalldataClient.getUsersWithDatasets).toHaveBeenCalledWith()

    await flushPromises()
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('tbody tr')).toHaveLength(1)
  })
})

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}
