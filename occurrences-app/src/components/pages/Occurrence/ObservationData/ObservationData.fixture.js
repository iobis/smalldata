import ObservationData from './ObservationData'

export default [{
  component: ObservationData,
  name:      'default',
  props:     {
    observationData: {
      institutionCode:         '',
      collectionCode:          '',
      fieldNumber:             '',
      catalogNumber:           '',
      recordNumber:            '',
      identifiedBy:            [],
      recordedBy:              [],
      identificationQualifier: '',
      identificationRemarks:   '',
      references:              []
    },
    onChange:        console.log
  }
}]
