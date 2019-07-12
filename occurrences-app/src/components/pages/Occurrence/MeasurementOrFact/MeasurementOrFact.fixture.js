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
  return []
}

export function getData() {
  return [{
    type:  'general-measurement-1',
    unit:  'general-measurement-1-unit-1',
    value: '123',
    units: getPressureUnits()
  }]
}

export function getPressureUnits() {
  return [
    { id: 'http://general-measurement-1-unit-1/', name: 'general-measurement-1-unit-1' },
    { id: 'http://general-measurement-1-unit-2/', name: 'general-measurement-1-unit-2' }
  ]
}
