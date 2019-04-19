import BasicData from './BasicData'

export default [{
  component: BasicData,
  name:      'no selection step',
  props:     {
    onChange:  console.log,
    basicData: {
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
  component: BasicData,
  name:      'with selections',
  props:     {
    onChange:  console.log,
    basicData: {
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
