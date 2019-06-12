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
      datasetRef: 'NnqVLwIyPn-nRkc-dataset-ref',
      userRef:    'ovZTtaOJZ98xDDY-user-ref'
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toBeCalledWith('/api/dwca/NnqVLwIyPn-nRkc-dataset-ref/user/ovZTtaOJZ98xDDY-user-ref/records')
  })
})
