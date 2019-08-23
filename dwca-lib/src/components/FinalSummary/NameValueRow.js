import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export default function NameValueRow({ className, name, value }) {
  return (
    <tr className={classNames('name-value-row fieldrow', className)}>
      <td className="name">{name}</td>
      <td className="value">{!value ? '—' : value}</td>
    </tr>
  )
}

NameValueRow.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  name:      PropTypes.string.isRequired,
  value:     PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
