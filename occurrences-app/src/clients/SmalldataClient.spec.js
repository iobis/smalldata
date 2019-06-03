import * as ServerClient from './server'
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

  it('datasetTitlesOf(datasets)', () => {
    expect(ServerClient.datasetTitlesOf(RESPONSE_DEFAULT)).toEqual([
      'Caprellids polulation structure in Usujiri, Hokkaido, Japan',
      'Benthos collected in the Azov Sea in 1935 on board the R/V "N. Danilevskiy"',
      'Antipatharia distribution data from: Deep-sea fauna of European seas - an annotated species check-list of benthic invertebrates living deeper than 2000 m in the seas bordering Europe',
      'Benthic data from Sevastopol (Black Sea)'
    ])
  })
})
