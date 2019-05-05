import MeasurementOrFact from './MeasurementOrFact'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faAngleDown)

export default [{
  component: MeasurementOrFact,
  name:      'for empty data',
  props:     {
    data:     getEmptyData(),
    onChange: console.log
  }
}]

export function getEmptyData() {
  return {}
}
