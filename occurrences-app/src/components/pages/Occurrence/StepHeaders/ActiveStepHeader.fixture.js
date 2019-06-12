import ActiveStepHeader from './ActiveStepHeader'

export default [{
  component: ActiveStepHeader,
  name:      'active step',
  props:     {
    onStepTitleClick: console.log,
    stepDescription:  'Choose the dataset for adding observations',
    stepTitle:        '1 - Select Dataset'
  }
}]
