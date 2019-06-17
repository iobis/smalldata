import * as SmalldataClient from './SmalldataClient'
import deepExtend from 'deep-extend'
import { DATASTES_RESPONSE } from './SmalldataClient.mock'

describe('SmalldataClient', () => {
  it('datasetTitleOf(dataset)', () => {
    expect(SmalldataClient.datasetTitleOf(DATASTES_RESPONSE[0]))
      .toEqual('Caprellids polulation structure in Usujiri, Hokkaido, Japan')
    expect(SmalldataClient.datasetTitleOf(null))
      .toEqual('')
  })

  describe('getDatasets()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => DATASTES_RESPONSE })
        })
      )
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('makes default request', async() => {
      await SmalldataClient.getDatasets()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/datasets')
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

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('getOccurrences()', async() => {
      await SmalldataClient.getOccurrences({ userRef: 'user-ref' })
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toBeCalledWith('/api/dwca/user/user-ref/records?projectFields=dwcRecord.tdwg.scientificName')
    })
  })

  describe('postOccurrence()', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => 'default-response' })
        })
      )
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('when providing all data', async() => {
      await SmalldataClient.postOccurrence(getDefaultOccurrence())

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(getDefaultOccurrenceRequest())
    })

    it('when providing life stage and sex as unspecified', async() => {
      await SmalldataClient.postOccurrence(deepExtend(getDefaultOccurrence(), {
        occurrence: {
          occurrenceData: {
            lifeStage: 'unspecified',
            sex:       'unspecified'
          }
        }
      }))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
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
      await SmalldataClient.postOccurrence(deepExtend(getDefaultOccurrence(), {
        occurrence: {
          occurrenceData: {
            endDate: null
          }
        }
      }))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
      expect(fetch.mock.calls[0][1].method).toBe('POST')
      expect(JSON.parse(fetch.mock.calls[0][1].body).occurrence[0].tdwg.eventDate).toEqual('2019-04-29/2019-04-29')
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
        beginDate:        Date.UTC(2019, 3, 29),
        endDate:          Date.UTC(2019, 3, 30),
        lifeStage:        'adult',
        occurrenceStatus: 'present',
        scientificName:   'ala abra',
        sex:              'male'
      },
      locationData:     {
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
        identificationQualifier: 'some identification qualifier',
        identificationRemarks:   'some identification remarks',
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

function getDefaultOccurrenceRequest() {
  return {
    core:       'occurrence',
    occurrence: [{
      tdwg:  {
        basisOfRecord:    'HumanObservation',
        eventDate:        '2019-04-29/2019-04-30',
        lifestage:        'adult',
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
