import { isScientificNameId, getByName, getById } from './MarineSpeciesClient'

describe('MarineSpeciesClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) => {
        resolve({ json: () => ([{ result: [] }]) })
      })
    )
  })

  afterEach(() => {
    global.fetch.mockRestore()
  })

  it('getByName', async() => {
    const response = await getByName('Ala abra')

    expect(response).toEqual([{ result: [] }])
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://www.marinespecies.org/rest/AphiaRecordsByName/Ala abra?like=true&marine_only=false')
  })

  it('getById', async() => {
    const response = await getById('urn:lsid:marinespecies.org:taxname:141433')

    expect(response).toEqual([{ result: [] }])
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://www.marinespecies.org/rest/AphiaRecordByAphiaID/141433')
  })

  it('isScientificNameId', () => {
    expect(isScientificNameId()).toBe(false)
    expect(isScientificNameId('')).toBe(false)
    expect(isScientificNameId('Ala Abra')).toBe(false)
    expect(isScientificNameId('urn:lsid:marinespecies.org')).toBe(false)
    expect(isScientificNameId('urn:lsid:marinespecies.org:taxname')).toBe(false)
    expect(isScientificNameId('urn:lsid:marinespecies.org:taxname:a')).toBe(false)
    expect(isScientificNameId('urn:lsid:marinespecies.org:taxname:141433a')).toBe(false)
    expect(isScientificNameId('urn:lsid:marinespecies.org:taxname:141433')).toBe(true)
  })
})
