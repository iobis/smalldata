import OccurrenceData from './OccurrenceData'

export default [{
  component: OccurrenceData,
  name:      'no selection step',
  props:     {
    onChange: console.log,
    data:     {
      basisOfRecord:    'humanObservation',
      beginDate:        Date.now(),
      endDate:          null,
      lifestage:        null,
      occurrenceStatus: 'present',
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
