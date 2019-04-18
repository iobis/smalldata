import bulmaCalendar from 'bulma-calendar'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

export default function DatePicker({ onChange, value }) {
  const datePickerEl = useRef()

  useEffect(() => {
    const calendar = bulmaCalendar.attach(datePickerEl.current, {
      type:        'date',
      displayMode: 'default',
      startDate:   value !== null ? new Date(value) : null
    })
    calendar[0].on('select', (e) => onChange(new Date(e.data.value())))
  }, [])

  return <input className="input" ref={datePickerEl} type="date" placeholder="Text input"/>
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value:    PropTypes.instanceOf(Date)
}
