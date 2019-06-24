import * as SmalldataClient from '../../../../clients/SmalldataClient'
import * as SmalldataClientFixture from '../../../../clients/SmalldataClient.mock'
import FinalSummary from './FinalSummary'

export default [{
  component: FinalSummary,
  name:      'default',
  url:       '/input-data/new',
  props:     {
    ...getDefaultProps()
  }
}, {
  component: FinalSummary,
  name:      'with error',
  url:       '/input-data/new',
  props:     {
    ...getDefaultProps(),
    errorVisible: true,
    errorMessage: 'error message'
  }
}, {
  component: FinalSummary,
  name:      'successfully submitted',
  url:       '/input-data/new',
  props:     {
    ...getDefaultProps(),
    successVisible: true
  }
}]

export function getDefaultProps() {
  return {
    dataset:          SmalldataClientFixture.DATASTES_RESPONSE.map(SmalldataClient.renameRefToId)[0],
    occurrenceData:   {
      basisOfRecord:    'humanObservation',
      beginDate:        Date.UTC(2019, 3, 29),
      endDate:          Date.UTC(2019, 3, 30),
      lifestage:        'adult',
      occurrenceStatus: 'absent',
      scientificName:   'ala abra',
      sex:              'male'
    },
    locationData:     {
      decimalLongitude:      2.345456,
      decimalLatitude:       51.3354656,
      coordinateUncertainty: null,
      minimumDepth:          null,
      maximumDepth:          null,
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
      recordedBy:              ['Harrison Ford'],
      identificationQualifier: 'some identification qualifier',
      identificationRemarks:   'some identification remarks',
      references:              ['http://www.google.com', 'https://clojure.org/']
    },
    measurements:     [
      { type: 'Pressure', unit: 'Decibars', value: '10' },
      { type: 'Pressure', unit: 'Decibars', value: '50' }
    ],
    darwinCoreFields: [
      { name: 'name-1', value: 'value-1' },
      { name: 'name-2', value: 'value-2' },
      { name: 'name-3', value: 'value-3' }
    ],
    onChangeClick:    console.log,
    onSubmitClick:    console.log,
    onErrorClose:     console.log,
    errorVisible:     false
  }
}
