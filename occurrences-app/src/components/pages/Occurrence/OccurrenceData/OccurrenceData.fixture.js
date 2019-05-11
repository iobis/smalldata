import OccurrenceData from './OccurrenceData'

export default [{
  component: OccurrenceData,
  name:      'no selection step',
  props:     {
    onChange: console.log,
    data:     {
      basisOfRecord:    null,
      beginDate:        new Date(),
      endDate:          null,
      lifestage:        null,
      occurrenceStatus: null,
      scientificName:   '',
      sex:              null
    }
  }
}, {
  component: OccurrenceData,
  name:      'with selections',
  props:     {
    onChange: console.log,
    data:     {
      basisOfRecord:    'humanObservation',
      beginDate:        new Date(),
      endDate:          new Date(),
      lifestage:        'adult',
      occurrenceStatus: 'absent',
      scientificName:   'ala abra',
      sex:              'male'
    }
  }
}]
