import PropTypes from 'prop-types'
import React from 'react'

export default function InputRadio({ checked, text = '', name, onChange, value }) {
  const id = name + '-' + value
  return (
    <>
      <input
        checked={checked}
        className="input-radio is-checkradio"
        id={id}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        type="radio"
        value={value}/>
      <label htmlFor={id}>{text}</label>
    </>
  )
}

InputRadio.propTypes = {
  checked:  PropTypes.bool.isRequired,
  name:     PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  text:     PropTypes.string,
  value:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}
