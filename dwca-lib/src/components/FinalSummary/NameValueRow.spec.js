import NameValueRow from './NameValueRow'
import React from 'react'
import { mount } from 'enzyme'

describe('NameValueRow', () => {
  it('renders correctly for string value', () => {
    expect(mount(
      <table>
        <tbody>
          <NameValueRow name="name" value="value string"/>
        </tbody>
      </table>
    )).toMatchSnapshot()
  })

  it('renders correctly for numeric value', () => {
    expect(mount(
      <table>
        <tbody>
          <NameValueRow name="name" value={12345}/>
        </tbody>
      </table>
    )).toMatchSnapshot()
  })

  it('renders correctly if className is provided', () => {
    expect(mount(
      <table>
        <tbody>
          <NameValueRow className="custom-class-name" name="name" value={12345}/>
        </tbody>
      </table>
    )).toMatchSnapshot()
  })
})
