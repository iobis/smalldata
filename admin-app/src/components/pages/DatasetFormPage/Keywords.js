import React from 'react'
import InputMultipleText from '@smalldata/dwca-lib/src/components/form/InputMultipleText'
import PropTypes from 'prop-types'

export default function Keywords({ keywords, onChange }) {
  return (
    <div className="keywords section is-fluid">
      <InputMultipleText
        className="keywords-input"
        name="datasetFormPage.keywords.keywords"
        onChange={onChange}
        values={keywords}/>
    </div>
  )
}

Keywords.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
}
