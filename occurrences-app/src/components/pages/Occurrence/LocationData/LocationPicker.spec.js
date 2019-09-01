import LocationPicker from './LocationPicker'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme/build'

jest.useFakeTimers()

describe('LocationPicker', () => {
  let wrapper

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) => {
        resolve({
          json: () => ([{
            'MRGID':                      18678,
            'gazetteerSource':            'IMIS',
            'placeType':                  'City',
            'latitude':                   59.883299999999998,
            'longitude':                  30.25,
            'minLatitude':                null,
            'minLongitude':               null,
            'maxLatitude':                null,
            'maxLongitude':               null,
            'precision':                  null,
            'preferredGazetteerName':     'Sankt-Petersburg',
            'preferredGazetteerNameLang': 'Russian',
            'status':                     'standard',
            'accepted':                   18678
          }])
        })
      })
    )
  })

  afterEach(() => {
    global.fetch.mockRestore()
  })

  it('renders correctly', async() => {
    await act(async() => {
      wrapper = mount(createComponent())
    })
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  it('makes fetch request when changing input field', async() => {
    const onChange = jest.fn()
    await act(async() => {
      wrapper = mount(createComponent({ onChange }))
    })
    wrapper.update()
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(true)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(0)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('')

    await act(async() => {
      wrapper.find('.search-string').simulate('change', { target: { value: 'St. Petersburg, Russ' } })
      jest.runAllTimers()
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(0)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://api.obis.org/marineregions/getGazetteerRecordsByName.json/St. Petersburg, Russ/true/false')
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(false)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(1)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('St. Petersburg, Russ')

    await act(async() => {
      wrapper.find('.suggestions-result .suggestion-row').simulate('click')
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, { latitude: 59.8833, longitude: 30.25 })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(false)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(1)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('St. Petersburg, Russ')

    await act(async() => {
      wrapper.find('.times-circle').at(0).simulate('click')
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(true)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(0)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('')
  })
})

function createComponent(props) {
  const defaultProps = {
    onChange: jest.fn()
  }
  return <LocationPicker {...defaultProps} {...props}/>
}
