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
    decimalLongitude:      null,
    decimalLatitude:       null,
    coordinateUncertainty: null,
    minimumDepth:          null,
    maximumDepth:          null,
    verbatimCoordinates:   '',
    verbatimEventDate:     '',
    verbatimDepth:         ''
  }
}
