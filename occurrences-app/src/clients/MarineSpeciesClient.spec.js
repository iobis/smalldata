import { isScientificNameId, getByName, getById } from './MarineSpeciesClient'

describe('MarineSpeciesClient', () => {
  describe('getByExpertByName', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ text: () => '[{ "result": [] }]' })
        })
      )
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('for some name', async() => {
      const response = await getByName('Abra alba')

      expect(response).toEqual([{ result: [] }])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('http://www.marinespecies.org/rest/AphiaRecordsByName/Abra alba?like=true&marine_only=false')
    })

    it('for name with extra whitespaces spaces', async() => {
      const response = await getByName('  Ala   ')

      expect(response).toEqual([{ result: [] }])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('http://www.marinespecies.org/rest/AphiaRecordsByName/Ala?like=true&marine_only=false')
    })

    it('for name with spaces only', async() => {
      const response = await getByName('     ')

      expect(response).toEqual([])
      expect(fetch).toHaveBeenCalledTimes(0)
    })
  })

  describe('getById', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ text: () => '{"result": "ok"}' })
        })
      )
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('for correct id', async() => {
      const response = await getById('urn:lsid:marinespecies.org:taxname:141433')

      expect(response).toEqual({ result: 'ok' })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('http://www.marinespecies.org/rest/AphiaRecordByAphiaID/141433')
    })
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
