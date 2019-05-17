import FinalSummary from './FinalSummary'

export default [{
  component: FinalSummary,
  name:      'FinalSummary',
  props:     {
    ...getDefaultProps(),
    onChange: console.log,
    onSubmit: console.log
  }
}]

export function getDefaultProps() {
  return {}
}
