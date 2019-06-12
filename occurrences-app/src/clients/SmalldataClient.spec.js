import * as SmalldataClient from './SmalldataClient'
import { RESPONSE_DEFAULT } from './SmalldataClient.mock'

describe('SmalldataClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) => {
        resolve({ json: () => RESPONSE_DEFAULT })
      })
    )
  })

  afterEach(() => {
    global.fetch.mockRestore()
  })

  it('getDatasets()', async() => {
    await SmalldataClient.getDatasets()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toBeCalledWith('/api/datasets')
  })

  it('datasetTitleOf(dataset)', () => {
    expect(SmalldataClient.datasetTitleOf(RESPONSE_DEFAULT[0]))
      .toEqual('Caprellids polulation structure in Usujiri, Hokkaido, Japan')
    expect(SmalldataClient.datasetTitleOf(null))
      .toEqual('')
  })

  it('postOccurrence()', async() => {
    await SmalldataClient.postOccurrence({
      occurence: {
        dataset:        {
          id:    'wEaBfmFyQhYCdsk',
          title: {
            value: 'Caprellids polulation structure in Usujiri, Hokkaido, Japan'
          }
        },
        occurrenceData: {
          basisOfRecord:    'humanObservation',
          beginDate:        Date.UTC(2019, 3, 29),
          endDate:          Date.UTC(2019, 3, 30),
          lifeStage:        'adult',
          occurrenceStatus: 'present',
          scientificName:   'ala abra',
          sex:              'male'
        }
      }
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
    expect(fetch.mock.calls[0][1].method).toBe('POST')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      core:       'occurrence',
      occurrence: [{
        tdwg: {
          datasetID:        'wEaBfmFyQhYCdsk',
          datasetName:      'Caprellids polulation structure in Usujiri, Hokkaido, Japan',
          basisOfRecord:    'HumanObservation',
          eventDate:        '2019-04-29/2019-04-30',
          lifestage:        'adult',
          occurrenceStatus: 'present',
          scientificName:   'ala abra',
          sex:              'male'
        }
      }],
      emof:       [{
        purl:  {},
        iobis: {}
      }, {
        iobis: {}
      }]
    })
  })
})
