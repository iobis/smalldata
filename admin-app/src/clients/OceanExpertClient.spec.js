import { getExpertById, searchExpertsByName } from './OceanExpertClient'

describe('OceanExpertClient', () => {
  afterEach(() => {
    global.fetch.mockRestore()
  })

  describe('searchExpertsByName', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({
            json: () => ({
              results: { data: [createUser(), createUserWithoutName(), createInstitutionsRecord()] }
            })
          })
        })
      )
    })

    it('for some name', async() => {
      const response = await searchExpertsByName('Firstname')

      expect(response).toEqual([createUser()])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://www.oceanexpert.net/api/v1/advanceSearch/search.json?action=browse&type=all&query=Firstname')
    })

    it('for name with extra whitespaces spaces', async() => {
      const response = await searchExpertsByName('  Firstname   ')

      expect(response).toEqual([createUser()])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://www.oceanexpert.net/api/v1/advanceSearch/search.json?action=browse&type=all&query=Firstname')
    })

    it('for name with spaces only', async() => {
      const response = await searchExpertsByName('     ')

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

      it('for not found response', async() => {
        const response = await searchExpertsByName('some strange name')

        expect(fetch).toHaveBeenCalledTimes(1)
        expect(response).toEqual([])
      })
    })
  })

  describe('getExpertById(someId)', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({
            json: () => ({
              fname:  'firstName',
              sname:  'lastName',
              email1: 'private@email.com'
            })
          })
        })
      )
    })

    it('for not found response', async() => {
      const response = await getExpertById('expert-id')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://www.oceanexpert.net/api/v1/expert/expert-id.json')
      expect(response).toEqual({ email: 'private@email.com', name: 'firstName lastName' })
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

function createInstitutionsRecord() {
  return {
    'type':          'institutions',
    'activated':     '1',
    'id_inst':       '7432',
    'instType':      'Research',
    'inst_name':     'National Association of Manufacturers and Producers of Canned Fish and Shellfish',
    'inst_name_eng': '',
    'inst_address':  'Crta. Colegio Universitario, 16\r\n ',
    'addr_2':        '',
    'instCity':      'Vigo',
    'instState':     'Pontevedra',
    'instPostCode':  '36310',
    'country':       'Spain',
    'activities':    'Bioassay method for PSP and DSP toxins; determination of okadaic acid by HPLC; DSP toxin stability; comparison between bioassay and HPLC methods for detection of DSP toxins; Dinophysis spp.; bivalve m',
    'relevance':     '0',
    'jobtitle':      '',
    'eventtype':     '',
    'fname':         '',
    'sname':         '',
    'name':          '',
    'parent_id':     '0'
  }
}
