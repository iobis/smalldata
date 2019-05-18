import FinalSummary from './FinalSummary'

export default [{
  component: FinalSummary,
  name:      'FinalSummary',
  props:     {
    ...getDefaultProps(),
    onChange: console.log,
    onSubmit: console.log
  }
}]

export function getDefaultProps() {
  return {
    dataset:        {
      id:          1,
      description: 'NPPSD Short-tailed Albatross Sightings'
    },
    occurrenceData: {
      basisOfRecord:    'humanObservation',
      beginDate:        new Date(),
      endDate:          new Date(),
      lifestage:        'adult',
      occurrenceStatus: 'absent',
      scientificName:   'ala abra',
      sex:              'male'
    },
    locationData:   {
      decimalLongitude:      2.345456,
      decimalLatitude:       51.3354656,
      coordinateUncertainty: '40 meters',
      minimumDepth:          null,
      maximumDepth:          null,
      verbatimCoordinates:   '41 05 54S 121 05 34W',
      verbatimDepth:         '100 - 200 m'
    }
  }
}
