import PropTypes from 'prop-types'
import React from 'react'

export default function InputRadio({ checked, text = '', name, onChange, value }) {
  const id = name + '-' + value
  return (
    <>
      <input
        className="is-checkradio"
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
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
