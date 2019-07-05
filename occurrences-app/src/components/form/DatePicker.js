import bulmaCalendar from 'bulma-calendar'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'

export default function DatePicker({ onChange, value }) {
  const datePickerEl = useRef()
  const [instance, setInstance] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date(value))

  function handleValueChange(e) {
    const newDate = new Date(e.data.value())
    setSelectedDate(newDate)
    onChange(newDate)
  }

  useEffect(() => {
    if (instance === null) {
      const calendar = bulmaCalendar.attach(datePickerEl.current, {
        dateFormat:         'D MMMM YYYY',
        displayMode:        'default',
        showFooter:         false,
        showHeader:         false,
        startDate:          value !== null ? new Date(value) : null,
        toggleOnInputClick: true,
        type:               'date'
      })
      const instance = calendar[0]
      instance.on('select', handleValueChange)
      setInstance(instance)
    } else if (differenceInCalendarDays(new Date(value), selectedDate) !== 0) {
      instance.value(value)
    }
  }, [value])

  return <input className="input" ref={datePickerEl} type="date"/>
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value:    PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number])
}
