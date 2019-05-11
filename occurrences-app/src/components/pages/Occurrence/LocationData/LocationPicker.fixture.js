import LocationPicker from './LocationPicker'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faSearch, faTimesCircle)

export default [{
  component: LocationPicker,
  name:      'default',
  props:     {
    onChange: console.log
  }
}]
