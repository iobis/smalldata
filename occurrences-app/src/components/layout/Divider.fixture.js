import Divider from './Divider'
import React from 'react'

export default {
  component: props => (
    <div style={{ paddingTop: '1rem' }}>
      <Divider {...props}/>
    </div>
  ),
  props:     {
    children: 'OR'
  }
}
