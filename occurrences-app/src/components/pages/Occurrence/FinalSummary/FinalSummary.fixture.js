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
    }
  }
}
