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
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('/api/dwca/wEaBfmFyQhYCdsk/user/ovZTtaOJZ98xDDY/records')
    expect(fetch.mock.calls[0][1].method).toBe('POST')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      core:       'occurrence',
      occurrence: [{
        tdwg: {
          datasetName: 'Caprellids polulation structure in Usujiri, Hokkaido, Japan',

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
          recordedBy:              'Harrison Ford, Indiana Jones',
          identificationQualifier: 'some identification qualifier',
          identificationRemarks:   'some identification remarks',

          collectionID: 'urn:lsid:biocol.org:col:34818'
        },
        purl: {
          references: 'http://www.google.com, https://clojure.org/',
          language:   'es'
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
    })
  })
})
