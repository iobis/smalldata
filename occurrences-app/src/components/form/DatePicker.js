import Flatpickr from 'react-flatpickr'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export default function DatePicker({ value, onChange }) {
  const [newValue, setNewValue] = useState(value)

  useEffect(() => {
    onChange(newValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue])

  useEffect(() => {
    setNewValue(value)
  }, [value])

  return (
    <Flatpickr
      className="input"
      onChange={(selectedDates) => selectedDates.length > 0 ? setNewValue(new Date(selectedDates[0])) : setNewValue(null)}
      value={newValue}/>
  )
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value:    PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number])
}
