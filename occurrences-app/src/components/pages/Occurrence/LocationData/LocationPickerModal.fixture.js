import LocationPickerModal from './LocationPickerModal'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faSearch, faTimesCircle)

export default [{
  component: LocationPickerModal,
  name:      'default',
  props:     {
    active:   true,
    onChange: console.log,
    onClose:  console.log
  }
}]
