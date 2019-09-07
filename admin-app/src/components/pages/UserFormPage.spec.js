import React from 'react'
import UserFormPage from './UserFormPage'
import { act } from 'react-dom/test-utils'
import { AuthProvider } from '@smalldata/dwca-lib'
import { getDatasetDefaultResponse } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

describe('UserFormPage', () => {
  let wrapper

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) => {
        resolve({ json: () => getDatasetDefaultResponse() })
      })
    )
  })

  afterEach(() => {
    global.fetch.mockRestore()
  })

  it('renders correctly for successful workflow', async() => {
    await act(async() => {
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
        'Content-Type': 'application/json'
      }
    })
    expect(wrapper.find('.dataset-row')).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()

    wrapper.update()
    expect(wrapper.find('.dataset-row')).toHaveLength(4)
    expect(wrapper.find('h1').text()).toBe('userFormPage.header.create {"name":""}')
    expect(wrapper.find('.dataset-row')).toHaveLength(4)
    expect(wrapper.find('.dropdown .selected-value').text()).toBe('researcher')
    expect(wrapper.exists('.success-message')).toBe(false)
    expect(wrapper.exists('.error-message')).toBe(false)
    expect(wrapper.exists('.submit-user-button')).toBe(true)
    expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(true)
    expect(wrapper.find('.submit-user-button button').text()).toBe('userFormPage.submitUserButton.create')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.ocean-expert-name-input .input').simulate('change', { target: { value: 'Indiana Jones' } })
    wrapper.update()
    expect(wrapper.find('h1').text()).toBe('userFormPage.header.create {"name":""}')
    expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('Indiana Jones')
    expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(true)

    wrapper.find('.email input').simulate('change', { target: { value: 'indiana.jones@gmail.com' } })
    wrapper.update()
    expect(wrapper.find('.email input').prop('value')).toBe('indiana.jones@gmail.com')
    expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(false)

    wrapper.find('.dropdown').at(1).simulate('click')
    wrapper.find('.dropdown .dropdown-item').at(1).simulate('click')
    wrapper.update()
    expect(wrapper.find('.dropdown .selected-value').text()).toBe('node manager')
    expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(false)

    await act(async() => {
      wrapper.find('.submit-user-button button').simulate('click')
    })
    wrapper.update()
    expect(wrapper.exists('.submit-user-button')).toBe(false)
    expect(wrapper.exists('.success-message')).toBe(true)
    expect(wrapper.find('.success-message .title').text()).toEqual('userFormPage.successMessage.header.create')
    expect(wrapper.exists('.error-message')).toBe(false)
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/users', {
      'body':    JSON.stringify({
        'dataset_refs': [],
        'emailAddress': 'indiana.jones@gmail.com',
        'name':         'Indiana Jones',
        'role':         'node manager'
      }),
      'headers': {
        'Content-Type': 'application/json'
      },
      'method':  'POST'
    })

    wrapper.find('.success-message .create-another-user').simulate('click')
    expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('')
    expect(wrapper.find('.email input').prop('value')).toBe('')
    expect(wrapper.find('.dropdown .selected-value').text()).toBe('researcher')
    expect(wrapper.exists('.submit-user-button')).toBe(true)
    expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(true)
    expect(wrapper.find('.submit-user-button button').text()).toEqual('userFormPage.submitUserButton.create')
    expect(wrapper.exists('.success-message')).toBe(false)
    expect(wrapper.exists('.error-message')).toBe(false)
  })

  describe('when editing', () => {
    it('renders correctly for successful workflow', async() => {
      await act(async() => {
        wrapper = mount(
          <MemoryRouter
            initialEntries={[{ pathname: '/manage-users/update/5d2b7998c1d37d36d4a41ab8', key: 'testKey' }]}>
            <AuthProvider>
              <UserFormPage
                location={{
                  state: {
                    action:     'update',
                    id:         '5d2b7998c1d37d36d4a41ab8',
                    datasetIds: ['ntDOtUc7XsRrIus'],
                    email:      'indiana.jones@gmail.com',
                    name:       'Indiana Jones',
                    role:       'node manager'
                  }
                }}/>
            </AuthProvider>
          </MemoryRouter>
        )
      })
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('/api/datasets', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      expect(wrapper.find('.dataset-row')).toHaveLength(0)
      expect(wrapper).toMatchSnapshot()

      wrapper.update()
      expect(wrapper.find('.dataset-row')).toHaveLength(4)
      expect(wrapper.find('h1').text()).toBe('userFormPage.header.update {"name":"Indiana Jones"}')
      expect(wrapper.find('.dataset-row')).toHaveLength(4)
      expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('Indiana Jones')
      expect(wrapper.find('.email input').prop('value')).toBe('indiana.jones@gmail.com')
      expect(wrapper.find('.dropdown .selected-value').text()).toBe('node manager')
      expect(wrapper.find('.dataset-row input').map(el => el.props().checked)).toEqual([false, true, false, false])
      expect(wrapper.exists('.success-message')).toBe(false)
      expect(wrapper.exists('.error-message')).toBe(false)
      expect(wrapper.exists('.submit-user-button')).toBe(true)
      expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(false)
      expect(wrapper.find('.submit-user-button button').text()).toBe('userFormPage.submitUserButton.update')
      expect(wrapper).toMatchSnapshot()

      wrapper.find('.ocean-expert-name-input .input').simulate('change', { target: { value: 'Harrison Ford' } })
      wrapper.update()
      expect(wrapper.find('h1').text()).toBe('userFormPage.header.update {"name":"Indiana Jones"}')
      expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('Harrison Ford')
      expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(false)

      wrapper.find('.email input').simulate('change', { target: { value: 'harrison.ford@gmail.com' } })
      wrapper.update()
      expect(wrapper.find('.email input').prop('value')).toBe('harrison.ford@gmail.com')
      expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(false)

      wrapper.find('.dropdown').at(1).simulate('click')
      wrapper.find('.dropdown .dropdown-item').at(0).simulate('click')
      wrapper.update()
      expect(wrapper.find('.dropdown .selected-value').text()).toBe('researcher')
      expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(false)

      await act(async() => {
        wrapper.find('.submit-user-button button').simulate('click')
      })
      wrapper.update()
      expect(wrapper.exists('.submit-user-button')).toBe(false)
      expect(wrapper.exists('.success-message')).toBe(true)
      expect(wrapper.find('.success-message .title').text()).toEqual('userFormPage.successMessage.header.update')
      expect(wrapper.exists('.error-message')).toBe(false)
      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/users/5d2b7998c1d37d36d4a41ab8', {
        'body':    JSON.stringify({
          'dataset_refs': ['ntDOtUc7XsRrIus'],
          'emailAddress': 'harrison.ford@gmail.com',
          'name':         'Harrison Ford',
          'role':         'researcher'
        }),
        'headers': {
          'Content-Type': 'application/json'
        },
        'method':  'PUT'
      })

      wrapper.find('.success-message .create-another-user').simulate('click')
      expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('')
      expect(wrapper.find('.email input').prop('value')).toBe('')
      expect(wrapper.find('.dropdown .selected-value').text()).toBe('researcher')
      expect(wrapper.exists('.submit-user-button')).toBe(true)
      expect(wrapper.find('.submit-user-button button').props()['disabled']).toBe(true)
      expect(wrapper.find('.submit-user-button button').text()).toEqual('userFormPage.submitUserButton.create')
      expect(wrapper.exists('.success-message')).toBe(false)
      expect(wrapper.exists('.error-message')).toBe(false)
    })
  })
})
