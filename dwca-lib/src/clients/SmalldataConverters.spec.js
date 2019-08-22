import * as SmalldataConverters from './SmalldataConverters'
import { getDatasetDefaultResponse, getDefaultDwcaResponse } from './SmalldataClient.mock'
import deepExtend from 'deep-extend'

describe('SmalldataConverters', () => {
  it('datasetTitleOf(dataset)', () => {
    expect(SmalldataConverters.datasetTitleOf(getDatasetDefaultResponse()[0]))
      .toEqual('Caprellids polulation structure in Usujiri, Hokkaido, Japan')
    expect(SmalldataConverters.datasetTitleOf(null))
      .toEqual('')
  })

  it('mapDwcaToOccurrenceData()', () => {
    expect(SmalldataConverters.mapDwcaToOccurrenceData(getDefaultDwcaResponse())).toEqual({
      basisOfRecord:    'machineObservation',
      beginDate:        new Date(Date.UTC(2019, 5, 25)),
      endDate:          new Date(Date.UTC(2019, 5, 26)),
      lifeStage:        'unspecified',
      occurrenceStatus: 'absent',
      scientificName:   'Aaadonta',
      sex:              'female'
    })
  })

  it('mapDwcaToOccurrenceData()', () => {
    expect(SmalldataConverters.mapDwcaToLocationData(getDefaultDwcaResponse())).toEqual({
      coordinateUncertainty: 1,
      decimalLatitude:       51.518463972439385,
      decimalLongitude:      -0.16771316528320315,
      maximumDepth:          3,
      minimumDepth:          2,
      verbatimCoordinates:   '17T 630000 4833400',
      verbatimDepth:         '100-200 m'
    })
  })

  describe('mapDwcaToObservationData()', () => {
    it('returns correct data when request has all data', () => {
      expect(SmalldataConverters.mapDwcaToObservationData(getDefaultDwcaResponse())).toEqual({
        institutionCode:         'Institution Code',
        collectionCode:          'Collection Code',
        fieldNumber:             'Field Number',
        catalogNumber:           'Catalog Number',
        recordNumber:            'Record Number',
        identifiedBy:            ['person-1', 'person-2'],
        recordedBy:              ['recorded-by-1', 'recorded-by-2'],
        identificationQualifier: 'Identification Qualifier',
        identificationRemarks:   'Identification Remarks',
        references:              ['www.google.com', 'https://clojure.org/']
      })
    })

    it('returns empty arrays if identified by, recorded by or references empty', () => {
      expect(SmalldataConverters.mapDwcaToObservationData(deepExtend(
        getDefaultDwcaResponse(),
        {
          dwcRecords: {
            occurrence: [{
              tdwg: {
                ...getDefaultDwcaResponse().dwcRecords.occurrence[0].tdwg,
                identifiedBy:         null,
                recordedBy:           null,
                associatedReferences: null
              }
            }]
          }
        })))
        .toEqual({
          institutionCode:         'Institution Code',
          collectionCode:          'Collection Code',
          fieldNumber:             'Field Number',
          catalogNumber:           'Catalog Number',
          recordNumber:            'Record Number',
          identifiedBy:            [],
          recordedBy:              [],
          identificationQualifier: 'Identification Qualifier',
          identificationRemarks:   'Identification Remarks',
          references:              []
        })
    })
  })

  describe('mapDwcaToMeasurements()', () => {
    it('returns correct data when measurements present', () => {
      expect(SmalldataConverters.mapDwcaToMeasurements(getDefaultDwcaResponse())).toMatchSnapshot()
    })

    it('returns empty array when measurements not present', () => {
      expect(SmalldataConverters.mapDwcaToMeasurements({})).toEqual([])
    })
  })

  it('mapDwcsToDarwinCoreFields()', () => {
    expect(SmalldataConverters.mapDwcsToDarwinCoreFields(getDefaultDwcaResponse())).toEqual([{
      name:  'http://rs.iobis.org/obis/terms/iobis-1',
      value: 'iobis-1-value'
    }, {
      name:  'http://rs.iobis.org/obis/terms/iobis-2',
      value: 'iobis-2-value'
    }, {
      name:  'http://purl.org/dc/terms/purl-field-1',
      value: 'purl-field-1-value'
    }, {
      name:  'http://purl.org/dc/terms/purl-field-2',
      value: 'purl-field-2-value'
    }, {
      name:  'http://rs.tdwg.org/dwc/terms/tdwg-field-1',
      value: 'tdwg-field-1-value'
    }, {
      name:  'http://rs.tdwg.org/dwc/terms/tdwg-field-2',
      value: 'tdwg-field-2-value'
    }])
  })

  it('mapDatasetToRequest(dataset)', () => {
    const uiDataset = {
      basicInformation:  {
        title:                  'Basic Data - Title',
        publishingOrganisation: 'Basic Data - Organisation',
        licence:                'Public Domain (CC0 1.0)',
        languageCode:           'en',
        abstract:               'Basic Data - Abstract'
      },
      resourceContacts:  [{
        name:         'Resource Contact - Name 1',
        email:        'Resource Contact - Email 1',
        organisation: 'Resource Contact - Organization 1',
        position:     'Resource Contact - Position 1'
      }, {
        name:         'Resource Contact - Name 2',
        email:        'Resource Contact - Email 2',
        organisation: 'Resource Contact - Organization 2',
        position:     'Resource Contact - Position 2'
      }],
      resourceCreators:  [{
        name:         'Resource Creator - Name - 1',
        email:        'Resource Creator - Email - 1',
        organisation: 'Resource Creator - Organization - 1',
        position:     'Resource Creator - Position - 1'
      }, {
        name:         'Resource Creator - Name - 2',
        email:        'Resource Creator - Email - 2',
        organisation: 'Resource Creator - Organization - 2',
        position:     'Resource Creator - Position - 2'
      }],
      metadataProviders: [{
        name:         'Metadata Providers - Name - 1',
        email:        'Metadata Providers - Email - 1',
        organisation: 'Metadata Providers - Organization - 1',
        position:     'Metadata Providers - Position - 1'
      }, {
        name:         'Metadata Providers - Name - 2',
        email:        'Metadata Providers - Email - 2',
        organisation: 'Metadata Providers - Organization - 2',
        position:     'Metadata Providers - Position - 2'
      }],
      keywords:          ['Keyword-1', 'Keyword-2']
    }

    const response = SmalldataConverters.mapDatasetToRequest(uiDataset)

    expect(response).toEqual({
      meta:              {
        type:      'occurrence',
        dwcTables: {
          core:       'occurrence',
          extensions: [
            'emof'
          ]
        }
      },
      title:             {
        language: 'en',
        value:    'Basic Data - Title'
      },
      language:          'en',
      abstract:          {
        paragraphs: [
          'This is one paragraph',
          'And this is another one...'
        ]
      },
      license:           {
        url:   'http://creativecommons.org/licenses/by-nc/4.0/legalcode',
        title: 'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License'
      },
      creators:          [{
        individualName: {
          givenName: 'Someone',
          surName:   'VeryImportant'
        }
      }],
      contacts:          [{
        individualName: {
          givenName: 'Also',
          surName:   'VeryImportant'
        }
      }],
      metadataProviders: [{
        individualName:        {
          givenName: 'ProbablySister',
          surName:   'VeryImportant'
        },
        electronicMailAddress: 'mostimportant@melibesearch.org'
      }],
      keywordSets:       [{
        keywords: ['Keyword-1', 'Keyword-2']
      }]
    })
  })
})
