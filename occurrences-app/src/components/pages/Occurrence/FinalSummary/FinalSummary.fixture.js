import * as SmalldataClientFixture from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import FinalSummary from './FinalSummary'

export default [{
  component: FinalSummary,
  name:      'default',
  url:       '/input-data/create',
  props:     {
    ...getDefaultProps()
  }
}, {
  component: FinalSummary,
  name:      'with error',
  url:       '/input-data/create',
  props:     {
    ...getDefaultProps(),
    errorVisible: true,
    errorMessage: 'error message'
  }
}, {
  component: FinalSummary,
  name:      'successfully submitted',
  url:       '/input-data/create',
  props:     {
    ...getDefaultProps(),
    successVisible: true
  }
}]

export function getDefaultProps() {
  return {
    dataset:          SmalldataClientFixture.getDatasetsFixture()[0],
    occurrenceData:   {
      basisOfRecord:    'humanObservation',
      lifeStage:        'adult',
      occurrenceStatus: 'absent',
      scientificName:   'ala abra',
      scientificNameId: 'urn:lsid:marinespecies.org:taxname:138133',
      sex:              'male',
      identificationQualifier: 'some identification qualifier',
      identificationRemarks:   'some identification remarks'
    },
    locationData:     {
      beginDate:             Date.UTC(2019, 3, 29),
      endDate:               Date.UTC(2019, 3, 30),
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
    errorVisible:     false,
    onChangeClick:    console.log,
    onErrorClose:     console.log,
    onSubmitClick:    console.log,
    successVisible:   false
  }
}
