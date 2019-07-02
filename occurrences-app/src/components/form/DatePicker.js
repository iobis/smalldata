import bulmaCalendar from 'bulma-calendar'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

export default function DatePicker({ onChange, value }) {
  const datePickerEl = useRef()

  useEffect(() => {
    const calendar = bulmaCalendar.attach(datePickerEl.current, {
      dateFormat:         'D MMMM YYYY',
      displayMode:        'default',
      showFooter:         false,
      showHeader:         false,
      startDate:          value !== null ? new Date(value) : null,
      toggleOnInputClick: true,
      type:               'date'
    })
    calendar[0].on('select', (e) => onChange(new Date(e.data.value())))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <input className="input" ref={datePickerEl} type="date"/>
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value:    PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number])
}
