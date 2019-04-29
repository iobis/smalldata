import PropTypes from 'prop-types'
import React, {useState} from 'react'
import InputText from '../../../form/InputText'

export default function DarwinCoreFields({ onChange }) {

  const [fields,setFields] = useState([
    { name: 'dummy field', value: 'dummy value' },
    { name:  'dummy2 field', value: 'dummy value' },
    { name: 'dummy3 field', value: 'dummy value' },
    { name: 'dummy4 field', value: 'dummy value' }
  ])

  const [name, setName] = useState('')
  const [value, setValue] = useState('')


  function makeDarwinCoreObject(){
    setFields([...fields,{name,value}])
  }

  return (
    <div className="darwin-core-fields section is-fluid">

      <h2>DARWIN CORE CUSTOM SELECTION</h2>
      <p>This form enables you to add any aditional fields you may need to specify, that were ot previously included in
        this form.
        Please be advised to use the Darwin Core Archive names</p>

      <div className="columns">
        <InputText className="field-name" name="occurrenceForm.darwinCoreFields.fieldName" onChange={setName}/>
        <InputText className="value" name="occurrenceForm.darwinCoreFields.value" onChange={setValue}/>
        <div className="column add"><a className="button" onClick={makeDarwinCoreObject}>add</a></div>
      </div>

      <table>
        <thead>
        <tr>
          <th>name</th>
          <th>value</th>
        </tr>
        </thead>
        <tbody>
        {fields.map(field =>
          <tr className="fieldrow" key={field.name + field.value}>
            <td>{field.name}</td>
            <td>{field.value}</td>
            
          </tr>
        )}
        </tbody>
      </table>

    </div>
  )
}

DarwinCoreFields.propTypes = {
  onChange: PropTypes.func.isRequired
}
