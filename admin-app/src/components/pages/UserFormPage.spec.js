import UserFormPage from './UserFormPage'
import { ignoreActWarning } from '@smalldata/test-utils-lib'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { getDatasetDefaultResponse } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { AuthProvider } from '@smalldata/dwca-lib'

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

  it('renders correctly', async(done) => {
    act(() => {
      wrapper = mount(<AuthProvider><UserFormPage/></AuthProvider>)
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

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('.dataset-row')).toHaveLength(4)
      expect(wrapper).toMatchSnapshot()
      done()
    }, 400)
  })
})
