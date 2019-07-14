import React from 'react'
import UserFormPage from './UserFormPage'
import waitUntil from 'async-wait-until'
import { act } from 'react-dom/test-utils'
import { AuthProvider } from '@smalldata/dwca-lib'
import { getDatasetDefaultResponse } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { ignoreActWarning } from '@smalldata/test-utils-lib'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

describe('UserFormPage', () => {
  ignoreActWarning()

  let wrapper

  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) => {
        resolve({ json: () => getDatasetDefaultResponse() })
      })
    )
  })

  it('renders correctly for successful workflow', async() => {
    act(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={[{ pathname: '/manage-users', key: 'testKey' }]}>
          <AuthProvider>
            <UserFormPage/>
          </AuthProvider>
        </MemoryRouter>
      )
    })
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/datasets', {
      headers: {
        'Authorization': 'Basic verysecret',
        'Content-Type':  'application/json'
      }
    })
    expect(wrapper.find('.dataset-row')).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()

    await waitUntil(() => {
      wrapper.update()
      return wrapper.find('.dataset-row').length === 4
    })
    expect(wrapper.find('.dataset-row')).toHaveLength(4)
    expect(wrapper.exists('.success-message')).toBe(false)
    expect(wrapper.exists('.error-message')).toBe(false)
    expect(wrapper.exists('.add-user-button')).toBe(true)
    expect(wrapper.find('.add-user-button button').props()['disabled']).toBe(true)
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.ocean-expert-name-input .input').simulate('change', { target: { value: 'Indiana Jones' } })
    wrapper.find('.email input').simulate('change', { target: { value: 'indiana.jones@gmail.com' } })
    wrapper.update()
    expect(wrapper.find('.add-user-button button').props()['disabled']).toBe(false)

    wrapper.find('.add-user-button button').simulate('click')
    await waitUntil(() => {
      wrapper.update()
      return wrapper.find('.add-user-button').length === 0
    })
    expect(wrapper.exists('.add-user-button')).toBe(false)
    expect(wrapper.exists('.success-message')).toBe(true)
    expect(wrapper.exists('.error-message')).toBe(false)

    wrapper.find('.success-message .create-another-user').simulate('click')
    expect(wrapper.exists('.add-user-button')).toBe(true)
    expect(wrapper.find('.add-user-button button').props()['disabled']).toBe(true)
    expect(wrapper.exists('.success-message')).toBe(false)
    expect(wrapper.exists('.error-message')).toBe(false)
  })
})
