import ConfirmedStepHeader from '../ConfirmedStepHeader'
import React from 'react'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faCheckCircle)

export default [{
  component: ConfirmedStepHeader,
  name:      'confirmed step',
  props:     {
    dataDescription: 'Using Data',
    selectedData:    'HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project.',
    stepDescription: 'Choose the dataset for adding observations',
    stepTitle:       '1 - Select Dataset'
  }
}]
