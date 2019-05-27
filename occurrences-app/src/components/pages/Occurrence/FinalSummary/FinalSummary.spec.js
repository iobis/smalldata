import FinalSummary from './FinalSummary'
import React from 'react'
import { getDefaultProps } from './FinalSummary.fixture'
import { mount } from 'enzyme'

describe('FinalSummary', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  describe('when clicking change button', () => {
    [{ className: 'select-dataset', event: 'selectDataset' },
      { className: 'occurrence-data', event: 'occurrenceData' },
      { className: 'location-data', event: 'locationData' },
      { className: 'observation-data', event: 'observationData' },
      { className: 'measurement-or-fact', event: 'measurementOrFact' },
      { className: 'darwin-core-fields', event: 'darwinCoreFields' }
    ].forEach(({ className, event }) => {
      it(`calls onChangeClick handler with ${event} when clicking change button in ${className}`, () => {
        const onChangeClick = jest.fn()
        const wrapper = mount(createComponent({ onChangeClick }))
        wrapper.find('.' + className + ' .change-button').simulate('click')
        expect(onChangeClick).toHaveBeenCalledTimes(1)
        expect(onChangeClick).toBeCalledWith(event)
      })
    })
  })
})

function createComponent(props) {
  const defaultProps = {
    ...getDefaultProps(),
    onChangeClick: jest.fn(),
    onSubmitClick: jest.fn()
  }

  return <FinalSummary {...defaultProps} {...props}/>
}
