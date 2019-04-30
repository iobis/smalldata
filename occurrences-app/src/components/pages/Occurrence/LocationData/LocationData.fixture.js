import LocationData from './LocationData'

export default [{
  component: LocationData,
  name:      'for empty data',
  props:     {
    data:     getEmptyData(),
    onChange: console.log
  }
}]

export function getEmptyData() {
  return {
    decimalLongitude:      '',
    decimalLatitude:       '',
    coordinateUncertainty: '',
    minimumDepth:          '',
    maximumDepth:          '',
    verbatimCoordinates:   '',
    verbatimEventDate:     '',
    verbatimDepth:         ''
  }
}
