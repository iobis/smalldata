import NotConfirmedStepHeader from './NotConfirmedStepHeader'

export default [{
  component: NotConfirmedStepHeader,
  name:      'not confirmed step',
  props:     {
    onStepTitleClick: console.log,
    stepDescription:  'Choose the dataset for adding observations',
    stepTitle:        '1 - Select Dataset'
  }
}]
