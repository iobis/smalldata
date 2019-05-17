import FinalSummary from './FinalSummary'
import React from 'react'
import { getDefaultProps } from './FinalSummary.fixture'
import { mount } from 'enzyme'

describe('FinalSummary', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })
})

function createComponent(props) {
  const defaultProps = {
    ...getDefaultProps(),
    onChange: jest.fn(),
    onSubmit: jest.fn()
  }

  return <FinalSummary {...defaultProps} {...props}/>
}
