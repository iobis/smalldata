import * as SmalldataConverters from './SmalldataConverters'
import { DATASTES_RESPONSE, getDefaultDwcaResponse } from './SmalldataClient.mock'

describe('SmalldataConverters', () => {
  it('datasetTitleOf(dataset)', () => {
    expect(SmalldataConverters.datasetTitleOf(DATASTES_RESPONSE[0]))
      .toEqual('Caprellids polulation structure in Usujiri, Hokkaido, Japan')
    expect(SmalldataConverters.datasetTitleOf(null))
      .toEqual('')
  })

  it('mapDwcaToOccurrenceData()', () => {
    expect(SmalldataConverters.mapDwcaToOccurrenceData(getDefaultDwcaResponse())).toEqual({
      basisOfRecord:    'machineObservation',
      beginDate:        new Date(Date.UTC(2019, 5, 25)),
      endDate:          new Date(Date.UTC(2019, 5, 26)),
      lifestage:        'unspecified',
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

  it('mapDwcaToObservationData()', () => {
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

  describe('mapDwcaToMeasurements()', () => {
    it('when measurements are present', () => {
      expect(SmalldataConverters.mapDwcaToMeasurements(getDefaultDwcaResponse())).toMatchSnapshot()
    })

    it('when measurements are not present', () => {
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
})
