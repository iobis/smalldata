import * as ServerClient from './SmalldataClient'
import { RESPONSE_DEFAULT } from './SmalldataClient.fixture'

describe('ServerClient', () => {
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
    await ServerClient.getDatasets()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toBeCalledWith('/api/datasets')
  })

  it('datasetTitleOf(dataset)', () => {
    expect(ServerClient.datasetTitleOf(RESPONSE_DEFAULT[0]))
      .toEqual('Caprellids polulation structure in Usujiri, Hokkaido, Japan')
    expect(ServerClient.datasetTitleOf(null))
      .toEqual('')
  })
})
