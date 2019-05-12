import OccurrenceData from './OccurrenceData'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faCheck)

export default [{
  component:   OccurrenceData,
  name:        'no selection step',
  props:       {
    data:     {
      basisOfRecord:    'humanObservation',
      beginDate:        Date.now(),
      endDate:          null,
      lifestage:        null,
      occurrenceStatus: 'present',
      scientificName:   '',
      sex:              null
    }
  },
  controllers: {
    onChange: data =>({ data })
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