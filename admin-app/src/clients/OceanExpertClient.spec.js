import { getByName } from './OceanExpertClient'

describe('OceanExpertClient', () => {
  describe('getByName', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({
            json: () => ({
              results: { data: [createUser(), createUserWithoutName()] }
            })
          })
        })
      )
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('for some name', async() => {
      const response = await getByName('Firstname')

      expect(response).toEqual([createUser()])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://www.oceanexpert.net/api/v1/advanceSearch/search.json?action=browse&type=all&query=Firstname')
    })

    it('for name with extra whitespaces spaces', async() => {
      const response = await getByName('  Firstname   ')

      expect(response).toEqual([createUser()])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://www.oceanexpert.net/api/v1/advanceSearch/search.json?action=browse&type=all&query=Firstname')
    })

    it('for name with spaces only', async() => {
      const response = await getByName('     ')

      expect(fetch).toHaveBeenCalledTimes(0)
      expect(response).toEqual([])
    })

    describe('when result is not found', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
          new Promise((resolve) => {
            resolve({
              json: () => ({
                results: 'No results found.'
              })
            })
          })
        )
      })

      afterEach(() => {
        global.fetch.mockRestore()
      })

      it('for not found response', async() => {
        const response = await getByName('some strange name')

        expect(fetch).toHaveBeenCalledTimes(1)
        expect(response).toEqual([])
      })
    })
  })
})

function createUser() {
  return {
    'type':          'experts',
    'status':        '1',
    'id_ind':        '12345',
    'name':          'Firstname Lastname',
    'fname':         'Firstname',
    'mname':         '',
    'sname':         'Lastname',
    'inst_name':     'UNESCO',
    'jobtitle':      '',
    'addr_1':        'addr-1',
    'addr_2':        'addr-2',
    'city':          'Ostend',
    'state':         'West Vlaanderen',
    'postcode':      '8400',
    'inst_address':  'Wandelaarkaai 7',
    'instAddr2':     'Pakhuis 61',
    'instCity':      'Oostende',
    'instState':     '',
    'instPostCode':  '8400',
    'use_inst_addr': '0',
    'deceased':      '0',
    'retired':       '0',
    'country':       'Belgium',
    'relevance':     '1',
    'instType':      '',
    'eventtype':     '',
    'inst_log':      ''
  }
}

function createUserWithoutName() {
  return {
    'type':          'experts',
    'status':        '1',
    'id_ind':        '12345',
    'name':          '',
    'fname':         '',
    'mname':         '',
    'sname':         '',
    'inst_name':     'UNESCO',
    'jobtitle':      '',
    'addr_1':        'addr-1',
    'addr_2':        'addr-2',
    'city':          'Ostend',
    'state':         'West Vlaanderen',
    'postcode':      '8400',
    'inst_address':  'Wandelaarkaai 7',
    'instAddr2':     'Pakhuis 61',
    'instCity':      'Oostende',
    'instState':     '',
    'instPostCode':  '8400',
    'use_inst_addr': '0',
    'deceased':      '0',
    'retired':       '0',
    'country':       'Belgium',
    'relevance':     '1',
    'instType':      '',
    'eventtype':     '',
    'inst_log':      ''
  }
}

