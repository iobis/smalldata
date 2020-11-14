import * as SmalldataConverters from './SmalldataConverters'
import {
  getDatasetDefaultResponse,
  getDatasetWithMissingUnitsInformation,
  getDefaultDwcaResponse
} from './SmalldataClient.mock'
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
      lifeStage:        'unspecified',
      occurrenceStatus: 'absent',
      scientificName:   'Aaadonta',
      scientificNameId: 'urn:lsid:marinespecies.org:taxname:995316',
      sex:              'female'
    })
  })

  it('mapDwcaToOccurrenceData()', () => {
    expect(SmalldataConverters.mapDwcaToLocationData(getDefaultDwcaResponse())).toEqual({
      coordinateUncertainty: 1,
      beginDate:             new Date(Date.UTC(2019, 5, 25)),
      endDate:               new Date(Date.UTC(2019, 5, 26)),
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

    it('returns empty array when units are missing', () => {
      expect(SmalldataConverters.mapDwcaToMeasurements(getDatasetWithMissingUnitsInformation())).toEqual([{
        type:  'biomass',
        unit:  'g/m2',
        units: [],
        value: '0.7'
      }, {
        type:  'individualcount',
        unit:  'ind/m2',
        units: [],
        value: '5'
      }])
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

  it('mapUiDatasetToRequest(dataset)', () => {
    const uiDataset = {
      basicInformation:  {
        title:    'Basic Data - Title',
        licence:  {
          url:   'http://creativecommons.org/licenses/by-nc/4.0/legalcode',
          title: 'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License'
        },
        language: 'English',
        abstract: 'Paragraph - 1\n\nParagraph - 2'
      },
      resourceContacts:  [{
        name:         'ResourceContact-1 Name-1',
        email:        'ResourceContact-1@acme.com',
        organisation: 'ResourceContact-1 Organization-1'
      }, {
        name:         'ResourceContact-2 Name-2',
        email:        'ResourceContact-2@acme.com',
        organisation: ''
      }, {
        name:         'ResourceContact-3 Name-3',
        email:        '',
        organisation: 'ResourceContact-3 Organization-3'
      }],
      resourceCreators:  [{
        name:         'ResourceCreator-1 Name-1',
        email:        'ResourceCreator-1@acme.com',
        organisation: 'ResourceCreator-1 Organization-1'
      }, {
        name:         'ResourceCreator-2 Name-2',
        email:        'ResourceCreator-2@acme.com',
        organisation: 'ResourceCreator-2 Organization-2'
      }],
      metadataProviders: [{
        name:         'MetadataProviders-1 Name-1',
        email:        'MetadataProviders-1@acme.com',
        organisation: 'MetadataProviders-1 Organization-1'
      }, {
        name:         'MetadataProviders-2 Name-2',
        email:        'MetadataProviders-2@acme.com',
        organisation: 'MetadataProviders-2 Organization-2'
      }],
      keywords:          ['Keyword-1', 'Keyword-2']
    }

    const response = SmalldataConverters.mapUiDatasetToRequest(uiDataset)

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
          'Paragraph - 1',
          'Paragraph - 2'
        ]
      },
      license:           {
        url:   'http://creativecommons.org/licenses/by-nc/4.0/legalcode',
        title: 'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License'
      },
      creators:          [{
        individualName:        {
          givenName: 'ResourceCreator-1',
          surName:   'Name-1'
        },
        organizationName:      'ResourceCreator-1 Organization-1',
        electronicMailAddress: 'ResourceCreator-1@acme.com'
      }, {
        individualName:        {
          givenName: 'ResourceCreator-2',
          surName:   'Name-2'
        },
        organizationName:      'ResourceCreator-2 Organization-2',
        electronicMailAddress: 'ResourceCreator-2@acme.com'
      }],
      contacts:          [{
        individualName:        {
          givenName: 'ResourceContact-1',
          surName:   'Name-1'
        },
        organizationName:      'ResourceContact-1 Organization-1',
        electronicMailAddress: 'ResourceContact-1@acme.com'
      }, {
        individualName:        {
          givenName: 'ResourceContact-2',
          surName:   'Name-2'
        },
        electronicMailAddress: 'ResourceContact-2@acme.com'
      }, {
        individualName:   {
          givenName: 'ResourceContact-3',
          surName:   'Name-3'
        },
        organizationName: 'ResourceContact-3 Organization-3'
      }],
      metadataProviders: [{
        individualName:        {
          givenName: 'MetadataProviders-1',
          surName:   'Name-1'
        },
        organizationName:      'MetadataProviders-1 Organization-1',
        electronicMailAddress: 'MetadataProviders-1@acme.com'
      }, {
        individualName:        {
          givenName: 'MetadataProviders-2',
          surName:   'Name-2'
        },
        organizationName:      'MetadataProviders-2 Organization-2',
        electronicMailAddress: 'MetadataProviders-2@acme.com'
      }],
      keywordSets:       [{
        keywords:         ['Occurrence'],
        keywordThesaurus: 'GBIF Dataset Type Vocabulary: http://rs.gbif.org/vocabulary/gbif/dataset_type.xml'
      }, {
        keywords:         ['Observation'],
        keywordThesaurus: 'GBIF Dataset Subtype Vocabulary: http://rs.gbif.org/vocabulary/gbif/dataset_subtype.xml'
      }, {
        keywords: ['Keyword-1', 'Keyword-2']
      }]
    })
  })

  it('mapDatasetResponseToBasicInformation(dataset)', () => {
    expect(SmalldataConverters.mapDatasetResponseToBasicInformation(getDatasetDefaultResponse()[3])).toEqual({
      title:    'Benthic data from Sevastopol (Black Sea)',
      licence:  'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License',
      language: 'English',
      abstract: 'paragraph-1\n\nparagraph-2'
    })
  })

  it('mapDatasetResponseToResourceContacts(dataset)', () => {
    expect(SmalldataConverters.mapDatasetResponseToResourceContacts(getDatasetDefaultResponse()[3])).toEqual([{
      email:        'arvanitidis@her.hcmr.gr',
      name:         'Christos Arvanitidis',
      organisation: 'Hellenic Centre for Marine Research (HCMR)'
    }])
  })

  it('mapDatasetResponseToResourceCreators(dataset)', () => {
    expect(SmalldataConverters.mapDatasetResponseToResourceCreators(getDatasetDefaultResponse()[3])).toEqual([{
      email:        'arvanitidis@her.hcmr.gr',
      name:         'Christos Arvanitidis',
      organisation: 'Hellenic Centre for Marine Research (HCMR)'
    }, {
      email:        '',
      name:         '',
      organisation: 'Hellenic Centre for Marine Research (HCMR)'
    }, {
      email:        'alexpet@ibss.iuf.net',
      name:         'Alexei Petrov',
      organisation: 'National Academy of Sciences of Ukraine Institute of Biology of the Southern Seas (NASU-IBSS'
    }])
  })

  it('mapDatasetResponseToMetadataProviders(dataset)', () => {
    expect(SmalldataConverters.mapDatasetResponseToMetadataProviders(getDatasetDefaultResponse()[3])).toEqual([{
      email:        'info@eurobis.org',
      name:         'EurOBIS Data Management Team',
      organisation: 'Flanders Marine Institute (VLIZ)'
    }])
  })

  it('mapDatasetResponseToKeywords(dataset)', () => {
    expect(SmalldataConverters.mapDatasetResponseToKeywords(getDatasetDefaultResponse()[0]))
      .toEqual(['Samplingevent'])

    expect(SmalldataConverters.mapDatasetResponseToKeywords(getDatasetDefaultResponse()[1]))
      .toEqual([])

    expect(SmalldataConverters.mapDatasetResponseToKeywords(getDatasetDefaultResponse()[3]))
      .toEqual([
        'Benthic biomass',
        'Benthos',
        'Data',
        'Marine Genomics'
      ])
  })
})
