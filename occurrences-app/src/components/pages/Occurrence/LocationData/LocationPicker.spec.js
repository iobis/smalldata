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
            MRGID:                      18678,
            gazetteerSource:            'IMIS',
            placeType:                  'City',
            latitude:                   59.883299999999998,
            longitude:                  30.25,
            minLatitude:                null,
            minLongitude:               null,
            maxLatitude:                null,
            maxLongitude:               null,
            precision:                  null,
            preferredGazetteerName:     'Sankt-Petersburg',
            preferredGazetteerNameLang: 'Russian',
            status:                     'standard',
            accepted:                   18678
          }, {
            MRGID:                      48986,
            accepted:                   48986,
            gazetteerSource:            null,
            latitude:                   null,
            longitude:                  null,
            maxLatitude:                null,
            maxLongitude:               null,
            minLatitude:                null,
            minLongitude:               null,
            placeType:                  'Province (administrative)',
            precision:                  null,
            preferredGazetteerName:     'Moscow Oblast',
            preferredGazetteerNameLang: 'English',
            status:                     'standard'
          }, {
            MRGID:                      2551,
            accepted:                   2551,
            gazetteerSource:            'ASFA thesaurus',
            latitude:                   51.33185,
            longitude:                  3.20845,
            maxLatitude:                51.3355,
            maxLongitude:               3.216,
            minLatitude:                51.3282,
            minLongitude:               3.2009,
            placeType:                  'Deelgemeente',
            precision:                  663.3265,
            preferredGazetteerName:     'Zeebrugge',
            preferredGazetteerNameLang: 'Dutch',
            status:                     'standard'
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

  it('fetches data from api and returns it with callback when changing input field', async() => {
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
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(2)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('St. Petersburg, Russ')

    await act(async() => {
      wrapper.find('.suggestions-result .suggestion-row').at(0).simulate('click')
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, {
      coordinateUncertainty: null,
      latitude:              59.8833,
      longitude:             30.25
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(false)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(2)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('St. Petersburg, Russ')

    await act(async() => {
      wrapper.find('.suggestions-result .suggestion-row').at(1).simulate('click')
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(2, {
      coordinateUncertainty: 663.3265,
      latitude:              51.33185,
      longitude:             3.20845
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(false)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(2)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('St. Petersburg, Russ')

    await act(async() => {
      wrapper.find('.times-circle').at(0).simulate('click')
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(true)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(0)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('')
  })

  it('trims value from search input field when user updating it', async() => {
    const onChange = jest.fn()
    await act(async() => {
      wrapper = mount(createComponent({ onChange }))
      wrapper.find('.search-string').simulate('change', { target: { value: '    Brugge    ' } })
      jest.runAllTimers()
    })
    wrapper.update()

    expect(onChange).toHaveBeenCalledTimes(0)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://api.obis.org/marineregions/getGazetteerRecordsByName.json/Brugge/true/false')
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(false)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(2)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('    Brugge    ')
  })
})

function createComponent(props) {
  const defaultProps = {
    onChange: jest.fn()
  }
  return <LocationPicker {...defaultProps} {...props}/>
}
