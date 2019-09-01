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
            'place_id':     30972305,
            'licence':      'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
            'osm_type':     'node',
            'osm_id':       2754437210,
            'boundingbox':  ['59.9402802', '59.9403802', '30.3189035', '30.3190035'],
            'lat':          '59.9403302',
            'lon':          '30.3189535',
            'display_name': 'Saint Petersburg, Northwestern Federal District, 190000, Russia',
            'class':        'amenity',
            'type':         'restaurant',
            'importance':   0.30100000000000005,
            'icon':         'https://nominatim.openstreetmap.org/images/mapicons/food_restaurant.p.20.png'
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
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://nominatim.openstreetmap.org/search?format=json&q=St. Petersburg, Russ')
    expect(wrapper.find('.suggestions-result-empty').exists()).toBe(false)
    expect(wrapper.find('.suggestions-result .suggestion-row')).toHaveLength(1)
    expect(wrapper.find('.search-string.input').prop('value')).toBe('St. Petersburg, Russ')

    await act(async() => {
      wrapper.find('.suggestions-result .suggestion-row').simulate('click')
    })
    wrapper.update()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, { latitude: 59.9403302, longitude: 30.3189535 })
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
