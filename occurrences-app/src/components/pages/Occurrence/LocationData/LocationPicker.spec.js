import React from 'react'
import ReactDOM from 'react-dom'
import LocationPicker from './LocationPicker'
import TestUtils, { act } from 'react-dom/test-utils'
import waitUntil from 'async-wait-until'

describe('LocationPicker', () => {
  const originalError = console.error
  let container

  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return
      originalError.call(console, ...args)
    }
    container = document.createElement('div')
  })

  afterAll(() => {
    console.error = originalError
    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
  })

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
            'display_name': 'Ля Русс, 37, Певческий проезд, Palace District, Центральный район, Saint Petersburg, Northwestern Federal District, 190000, Russia',
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

  it('renders correctly', () => {
    ReactDOM.render(createComponent(), container)
    expect(container).toMatchSnapshot()
  })

  it('makes fetch request when changing input field', async() => {
    act(() => {
      ReactDOM.render(createComponent(), container)
    })
    expect(container.querySelectorAll('.suggestions-result .suggestion-row')).toHaveLength(0)

    act(() => {
      TestUtils.Simulate.change(container.querySelector('.search-string'), { target: { value: 'St. Petersburg, Russ' } })
    })
    await waitUntil(() => fetch.mock.calls.length === 1)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://nominatim.openstreetmap.org/search?format=json&q=St. Petersburg, Russ')
    expect(container.querySelectorAll('.suggestions-result .suggestion-row')).toHaveLength(1)
  })
})

function createComponent() {
  return <LocationPicker onChange={jest.fn()}/>
}
