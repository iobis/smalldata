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
        dataset: {
          id:    'wEaBfmFyQhYCdsk',
          title: {
            value: 'Caprellids polulation structure in Usujiri, Hokkaido, Japan'
          }
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
          datasetID:   'wEaBfmFyQhYCdsk',
          datasetName: 'Caprellids polulation structure in Usujiri, Hokkaido, Japan'
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
