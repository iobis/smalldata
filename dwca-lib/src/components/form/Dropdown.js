import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from '@smalldata/dwca-lib'

export default function Dropdown({ onChange, options, value }) {
  const ref = useRef()
  const [active, setActive] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)
  const hideOptions = () => setActive(false)
  const showOptions = () => {if (active === false) setActive(true)}
  const handleChange = (item) => {
    onChange(item)
    setSelectedValue(item)
    setActive(false)
  }

  useOnClickOutside(ref, hideOptions)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  return (
    <div className={classNames('dropdown', { 'is-active': active })} onClick={showOptions} ref={ref}>
      <div className="dropdown-trigger">
        <button aria-controls="dropdown-menu" aria-haspopup="true" className="button">
          <span className="selected-value">{selectedValue}</span>
          <span className="icon is-small">
            <FontAwesomeIcon className="angle-down" icon="angle-down"/>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {options.map(option => (
            <div
              className={classNames('dropdown-item', { 'is-active': option === selectedValue })}
              key={option}
              onClick={() => handleChange(option)}>
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  options:  PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value:    PropTypes.string.isRequired
}
