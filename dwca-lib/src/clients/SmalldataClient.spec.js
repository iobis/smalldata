import * as SmalldataClient from './SmalldataClient'
import deepExtend from 'deep-extend'
import { getDatasetDefaultResponse, getUsersDefaultResponse, OCCURRENCES_RESPONSE } from './SmalldataClient.mock'

const expectedSecureHeaders = {
  'Authorization': 'Bearer ey-secret-jwt-token',
  'Content-Type':  'application/json'
}

const expectedNotSecuredHeaders = {
  'Content-Type': 'application/json'
}

describe('SmalldataClient', () => {
  const userRef = 'ovZTtaOJZ98xDDY'

  beforeEach(() => {
    SmalldataClient.init({ apiRoot: '/api/' })
    SmalldataClient.setSecurityToken('ey-secret-jwt-token')
  })

  afterEach(() => {
    global.fetch.mockRestore()
    SmalldataClient.deleteSecurityToken()
  })

  describe('when deleting security token', () => {
    it('does not send security token in a header', async() => {
      SmalldataClient.deleteSecurityToken()
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => getDatasetDefaultResponse() })
        })
      )
      await SmalldataClient.getDatasets()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/datasets', { headers: expectedNotSecuredHeaders })
    })
  })

  describe('when changing apiRoot', () => {
    it('updates api uri when providing not empty one', async() => {
      SmalldataClient.init({ apiRoot: 'http://internal.host.zone/api/' })
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => getDatasetDefaultResponse() })
        })
      )
      await SmalldataClient.getDatasets()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('http://internal.host.zone/api/datasets', { headers: expectedSecureHeaders })
    })

    it('keeps previous api config when providing empty', async() => {
      SmalldataClient.init()
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => getDatasetDefaultResponse() })
        })
      )
      await SmalldataClient.getDatasets()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/datasets', { headers: expectedSecureHeaders })
    })
  })

  describe('getDatasets()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => getDatasetDefaultResponse() })
        })
      )
    })

    it('makes default request', async() => {
      await SmalldataClient.getDatasets()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/datasets', { headers: expectedSecureHeaders })
    })
  })

  describe('createDataset()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('makes default request', async() => {
      await SmalldataClient.createDataset({
        basicInformation:  {
          title:    'title',
          language: 'English',
          licence:  {
            url:   'licence url',
            title: 'licence title'
          },
          abstract: 'abstract'
        },
        resourceContacts:  [],
        resourceCreators:  [],
        metadataProviders: [],
        keywords:          ['keyword-1']
      })
      expect(fetch.mock.calls[0][0]).toBe('/api/datasets')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchSnapshot()
    })
  })

  describe('updateDataset()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('makes default request', async() => {
      await SmalldataClient.updateDataset({
        basicInformation:  {
          title:    'title',
          language: 'English',
          licence:  {
            url:   'licence url',
            title: 'licence title'
          },
          abstract: 'abstract'
        },
        resourceContacts:  [],
        resourceCreators:  [],
        metadataProviders: [],
        keywords:          ['keyword-1']
      }, 'some-datasetId')
      expect(fetch.mock.calls[0][0]).toBe('/api/datasets/some-datasetId')
      expect(fetch.mock.calls[0][1].method).toBe('PUT')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchSnapshot()
    })
  })

  describe('getOccurrences()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('fetches data from correct url', async() => {
      await SmalldataClient.getOccurrences({ userRef })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/dwca/user/ovZTtaOJZ98xDDY/records?projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate', {
        headers: expectedSecureHeaders
      })
    })
  })

  describe('findLatestOccurrence()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => OCCURRENCES_RESPONSE })
        })
      )
    })

    it('fetches data from correct url', async() => {
      await SmalldataClient.findLatestOccurrence({ userRef })
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(1, '/api/dwca/user/ovZTtaOJZ98xDDY/records?projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate', {
        headers: expectedSecureHeaders
      })
      expect(fetch).toHaveBeenNthCalledWith(2, '/api/dwca/ntDOtUc7XsRrIus/user/ovZTtaOJZ98xDDY/records/IBSS_R%2FV%20N.%20Danilevskiy%201935%20Azov%20Sea%20benthos%20data_796', {
        headers: expectedSecureHeaders
      })
    })
  })

  describe('getOccurrence()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('fetches data from correct url', async() => {
      const datasetId = 'ntDOtUc7XsRrIus'
      const dwcaId = 'IkadeGqejSCC3Sc'
      await SmalldataClient.getOccurrence({ datasetId, dwcaId, userRef })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/dwca/ntDOtUc7XsRrIus/user/ovZTtaOJZ98xDDY/records/IkadeGqejSCC3Sc', {
        headers: expectedSecureHeaders
      })
    })

    it('encodes dwcaId', async() => {
      const datasetId = 'ntDOtUc7XsRrIus'
      const dwcaId = 'IBSS_R/V N. Danilevskiy 1935 Azov Sea benthos data_445'
      await SmalldataClient.getOccurrence({ datasetId, dwcaId, userRef })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/dwca/ntDOtUc7XsRrIus/user/ovZTtaOJZ98xDDY/records/IBSS_R%2FV%20N.%20Danilevskiy%201935%20Azov%20Sea%20benthos%20data_445', {
        headers: expectedSecureHeaders
      })
    })
  })

  describe('updateOccurrence()', () => {
    const dwcaId = 'IkadeGqejSCC3Sc'

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('when providing all data', async() => {
      await SmalldataClient.updateOccurrence({ ...getDefaultOccurrence(), ...{ userRef, dwcaId } })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records/IkadeGqejSCC3Sc')
      expect(fetch.mock.calls[0][1].method).toBe('PUT')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(getExpectedDefaultOccurrenceRequest())
    })
  })

  describe('createOccurrence()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('when providing all data', async() => {
      await SmalldataClient.createOccurrence({ ...getDefaultOccurrence(), ...{ userRef } })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(getExpectedDefaultOccurrenceRequest())
    })

    it('when providing life stage and sex as unspecified', async() => {
      await SmalldataClient.createOccurrence(
        deepExtend(
          getDefaultOccurrence(),
          {
            occurrence: {
              occurrenceData: {
                lifeStage: 'unspecified',
                sex:       'unspecified'
              }
            }
          },
          { userRef }))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body).occurrence[0].tdwg).toEqual({
        basisOfRecord:    'HumanObservation',
        eventDate:        '2019-04-29/2019-04-30',
        occurrenceStatus: 'present',
        scientificName:   'ala abra',

        decimalLongitude:              2.345456,
        decimalLatitude:               51.3354656,
        coordinateUncertaintyInMeters: 1,
        minimumDepthInMeters:          20,
        maximumDepthInMeters:          30,
        verbatimCoordinates:           '41 05 54S 121 05 34W',
        verbatimDepth:                 '100 - 200 m',

        institutionCode:         'IBSS',
        collectionCode:          'R/V N. Danilevskiy 1935 Azov Sea benthos data',
        fieldNumber:             '557',
        catalogNumber:           'IBSS_Benthos_1935_1331',
        recordNumber:            '123456',
        identifiedBy:            'Indiana Jones',
        recordedBy:              'Harrison Ford|Indiana Jones',
        identificationQualifier: 'some identification qualifier',
        identificationRemarks:   'some identification remarks',
        associatedReferences:    'http://www.google.com|https://clojure.org/',

        collectionID: 'urn:lsid:biocol.org:col:34818'
      })
    })

    it('when event end date is not provided', async() => {
      await SmalldataClient.createOccurrence(
        deepExtend(
          getDefaultOccurrence(),
          {
            occurrence: {
              occurrenceData: {
                endDate: null
              }
            }
          },
          { userRef })
      )

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body).occurrence[0].tdwg.eventDate).toEqual('2019-04-29/2019-04-30')
    })
  })

  describe('getUsers', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => getUsersDefaultResponse() })
        })
      )
    })

    it('makes default request', async() => {
      await SmalldataClient.getUsers()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/users', { headers: expectedSecureHeaders })
    })
  })

  describe('getUserByEmail(email)', () => {
    describe('when user found', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
          new Promise((resolve) => {
            resolve({ json: () => [getUsersDefaultResponse()[0]] })
          })
        )
      })

      afterEach(() => {
        global.fetch.mockRestore()
      })

      it('makes default request', async() => {
        const result = await SmalldataClient.getUserByEmail('some.user@domain.org')
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toBeCalledWith('/api/users/?emailAddress=some.user@domain.org', { headers: expectedSecureHeaders })
        expect(result).toEqual({
          '_id':          '5d21b9eb54308464b1a9e6c7',
          'bulkiness':    0,
          'dataset_refs': ['wEaBfmFyQhYCdsk', 'ntDOtUc7XsRrIus', 'PoJnGNMaxsupE4w', 'NnqVLwIyPn-nRkc'],
          'emailAddress': 'some.user@domain.org',
          'id':           'ovZTtaOJZ98xDDY'
        })
      })
    })

    describe('when user not found', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
          new Promise((resolve) => {
            resolve({ json: () => [] })
          })
        )
      })

      afterEach(() => {
        global.fetch.mockRestore()
      })

      it('makes default request', async() => {
        const result = await SmalldataClient.getUserByEmail('not-found@domain.org')
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toBeCalledWith('/api/users/?emailAddress=not-found@domain.org', { headers: expectedSecureHeaders })
        expect(result).toEqual({})
      })
    })
  })

  describe('getUsersWithDatasets', () => {
    beforeEach(() => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          new Promise((resolve) => {
            resolve({ json: () => getUsersDefaultResponse() })
          }))
        .mockImplementationOnce(() =>
          new Promise((resolve) => {
            resolve({ json: () => getDatasetDefaultResponse() })
          }))
    })

    it('makes 2 requests and combine them', async() => {
      const users = await SmalldataClient.getUsersWithDatasets()
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(1, '/api/users', { headers: expectedSecureHeaders })
      expect(fetch).toHaveBeenNthCalledWith(2, '/api/datasets', { headers: expectedSecureHeaders })
      expect(users).toMatchSnapshot()
      expect(users).toHaveLength(3)
      expect(users[0].datasets).toHaveLength(4)
      expect(users[0]['dataset_refs']).toHaveLength(4)
      expect(users[1].datasets).toHaveLength(3)
      expect(users[1]['dataset_refs']).toHaveLength(3)
      expect(users[2].datasets).toHaveLength(0)
      expect(users[2]['dataset_refs']).toHaveLength(0)
    })
  })

  describe('createUser()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('when providing all data', async() => {
      await SmalldataClient.createUser({
        datasetIds: ['dataset-ref-1', 'dataset-ref-2'],
        email:      'some@email.com',
        name:       'name',
        role:       'researcher'
      })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/users')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        'dataset_refs': ['dataset-ref-1', 'dataset-ref-2'],
        emailAddress:   'some@email.com',
        name:           'name',
        role:           'researcher'
      })
    })
  })

  describe('updateUser()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    it('when providing all data', async() => {
      await SmalldataClient.updateUser({
        id:         'user-id',
        datasetIds: ['dataset-ref-1', 'dataset-ref-2'],
        email:      'some@email.com',
        name:       'name',
        role:       'researcher'
      })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/users/user-id')
      expect(fetch.mock.calls[0][1].method).toBe('PUT')
      expect(fetch.mock.calls[0][1].headers).toEqual(expectedSecureHeaders)
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
        'dataset_refs': ['dataset-ref-1', 'dataset-ref-2'],
        emailAddress:   'some@email.com',
        name:           'name',
        role:           'researcher'
      })
    })
  })
})

function getDefaultOccurrence() {
  return {
    occurrence: {
      dataset:          {
        id:    'wEaBfmFyQhYCdsk',
        title: {
          value: 'Caprellids polulation structure in Usujiri, Hokkaido, Japan'
        }
      },
      occurrenceData:   {
        basisOfRecord:    'humanObservation',
        lifeStage:        'adult',
        occurrenceStatus: 'present',
        scientificName:   'ala abra',
        sex:              'male',
        identificationQualifier: 'some identification qualifier',
        identificationRemarks:   'some identification remarks'
      },
      locationData:     {
        beginDate:        Date.UTC(2019, 3, 29),
        endDate:          Date.UTC(2019, 3, 30),
        decimalLongitude:      2.345456,
        decimalLatitude:       51.3354656,
        coordinateUncertainty: 1,
        minimumDepth:          20,
        maximumDepth:          30,
        verbatimCoordinates:   '41 05 54S 121 05 34W',
        verbatimDepth:         '100 - 200 m'
      },
      observationData:  {
        institutionCode:         'IBSS',
        collectionCode:          'R/V N. Danilevskiy 1935 Azov Sea benthos data',
        fieldNumber:             '557',
        catalogNumber:           'IBSS_Benthos_1935_1331',
        recordNumber:            '123456',
        identifiedBy:            ['Indiana Jones'],
        recordedBy:              ['Harrison Ford', 'Indiana Jones'],
        references:              ['http://www.google.com', 'https://clojure.org/']
      },
      measurements:     [
        { type: 'Pressure', unit: 'Decibars', value: '10' },
        { type: 'Salinity', unit: 'PSU (dimensionless)', value: '50' }
      ],
      darwinCoreFields: [
        { name: 'http://purl.org/dc/terms/language', value: 'es' },
        { name: 'http://rs.tdwg.org/dwc/terms/collectionID', value: 'urn:lsid:biocol.org:col:34818' },
        { name: 'http://rs.iobis.org/obis/terms/measurementUnitID', value: 'measurementUnitID value' },
        { name: 'not supported name', value: 'not supported key value' }
      ]
    }
  }
}

function getExpectedDefaultOccurrenceRequest() {
  return {
    core:       'occurrence',
    occurrence: [{
      tdwg:  {
        basisOfRecord:    'HumanObservation',
        eventDate:        '2019-04-29/2019-04-30',
        lifeStage:        'adult',
        occurrenceStatus: 'present',
        scientificName:   'ala abra',
        sex:              'male',

        decimalLongitude:              2.345456,
        decimalLatitude:               51.3354656,
        coordinateUncertaintyInMeters: 1,
        minimumDepthInMeters:          20,
        maximumDepthInMeters:          30,
        verbatimCoordinates:           '41 05 54S 121 05 34W',
        verbatimDepth:                 '100 - 200 m',

        institutionCode:         'IBSS',
        collectionCode:          'R/V N. Danilevskiy 1935 Azov Sea benthos data',
        fieldNumber:             '557',
        catalogNumber:           'IBSS_Benthos_1935_1331',
        recordNumber:            '123456',
        identifiedBy:            'Indiana Jones',
        recordedBy:              'Harrison Ford|Indiana Jones',
        identificationQualifier: 'some identification qualifier',
        identificationRemarks:   'some identification remarks',
        associatedReferences:    'http://www.google.com|https://clojure.org/',

        collectionID: 'urn:lsid:biocol.org:col:34818'
      },
      purl:  {
        language: 'es'
      },
      iobis: {
        measurementUnitID: 'measurementUnitID value'
      }
    }],
    emof:       [{
      tdwg:  {
        measurementType:  'Pressure',
        measurementUnit:  'Decibars',
        measurementValue: '10'
      },
      iobis: {
        measurementTypeID: 'http://vocab.nerc.ac.uk/collection/P01/current/PRESPS02/',
        measurementUnitID: 'http://vocab.nerc.ac.uk/collection/P06/current/UPDB/'
      }
    }, {
      tdwg:  {
        measurementType:  'Salinity',
        measurementUnit:  'PSU (dimensionless)',
        measurementValue: '50'
      },
      iobis: {
        measurementTypeID: 'http://vocab.nerc.ac.uk/collection/P01/current/PSALCU01/',
        measurementUnitID: 'http://vocab.nerc.ac.uk/collection/P06/current/UUUU/'
      }
    }]
  }
}
