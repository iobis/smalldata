import ScientificNameInput from './ScientificNameInput'
import MarineSpeciesClient from '../../../../clients/MarineSpeciesClient'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.useFakeTimers()
jest.mock('../../../../clients/MarineSpeciesClient', () => ({
  getByName: jest.fn()
}))

describe('ScientificNameInput', () => {
  beforeEach(() => {
    MarineSpeciesClient.getByName.mockImplementation(() =>
      new Promise((resolve) => {
        resolve([
          {
            'AphiaID':           141433,
            'url':               'http://www.marinespecies.org/aphia.php?p=taxdetails&id=141433',
            'scientificname':    'Abra alba',
            'authority':         '(W. Wood, 1802)',
            'status':            'accepted',
            'unacceptreason':    null,
            'taxonRankID':       220,
            'rank':              'Species',
            'valid_AphiaID':     141433,
            'valid_name':        'Abra alba',
            'valid_authority':   '(W. Wood, 1802)',
            'parentNameUsageID': 138474,
            'kingdom':           'Animalia',
            'phylum':            'Mollusca',
            'class':             'Bivalvia',
            'order':             'Cardiida',
            'family':            'Semelidae',
            'genus':             'Abra',
            'citation':          'MolluscaBase (2019). MolluscaBase. Abra alba (W. Wood, 1802). Accessed through: World Register of Marine Species at: http://www.marinespecies.org/aphia.php?p=taxdetails&id=141433 on 2019-11-03',
            'lsid':              'urn:lsid:marinespecies.org:taxname:141433',
            'isMarine':          1,
            'isBrackish':        null,
            'isFreshwater':      null,
            'isTerrestrial':     null,
            'isExtinct':         null,
            'match_type':        'like',
            'modified':          '2010-09-23T10:34:21.967Z'
          }
        ])
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('updates values when updating props', async() => {
    const onChange = jest.fn()
    const onSuggestionClick = jest.fn()
    const wrapper = mount(createComponent({ scientificName: 'name-1', onChange, onSuggestionClick }))
    expect(wrapper.find('input').props().value).toBe('name-1')

    await act(async() => {
      wrapper.setProps({ scientificName: 'name-100500' })
      jest.runAllTimers()
    })
    wrapper.update()
    expect(MarineSpeciesClient.getByName).toHaveBeenCalledTimes(2)
    expect(wrapper.find('input').props().value).toBe('name-100500')
    expect(onChange).toHaveBeenCalledTimes(0)
    expect(onSuggestionClick).toHaveBeenCalledTimes(0)
  })

  it('returns values when updating input fields', async() => {
    const onChange = jest.fn()
    const onSuggestionClick = jest.fn()
    const wrapper = mount(createComponent({ scientificName: '', onChange, onSuggestionClick }))

    await act(async() => {
      wrapper.find('input').simulate('change', { target: { value: 'Abra alba' } })
      jest.runAllTimers()
    })
    wrapper.update()
    expect(MarineSpeciesClient.getByName).toHaveBeenCalledTimes(1)
    expect(MarineSpeciesClient.getByName).toHaveBeenCalledWith('Abra alba')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('Abra alba')
    expect(onSuggestionClick).toHaveBeenCalledTimes(0)
    expect(wrapper.find('.dropdown-item').hasClass('is-active')).toBe(true)
    expect(wrapper.find('.dropdown-item')).toHaveLength(1)

    wrapper.find('.dropdown-item').simulate('click')
    expect(onSuggestionClick).toHaveBeenCalledTimes(1)
    expect(onSuggestionClick).toHaveBeenCalledWith({
      scientificName:   'Abra alba',
      scientificNameId: 'urn:lsid:marinespecies.org:taxname:141433'
    })
  })
})

function createComponent(props) {
  const defaultProps = {
    scientificName: '',
    onChange:       jest.fn()
  }
  return <ScientificNameInput {...defaultProps} {...props}/>
}
