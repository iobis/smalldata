import MeasurementOrFact from './MeasurementOrFact'

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
