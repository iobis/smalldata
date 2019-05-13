import DarwinCoreFields from './DarwinCoreFields'

export default [{
  component: DarwinCoreFields,
  name:      'DarwinCoreFields',
  props:     {
    fields:   getDefaultFields(),
    onChange: console.log
  }
}]

export function getDefaultFields() {
  return [
    { name: 'name-1', value: 'value-1' },
    { name: 'name-2', value: 'value-2' },
    { name: 'name-3', value: 'value-3' }
  ]
}
