import FinalSummary from './FinalSummary'
import React from 'react'
import { getDefaultProps } from './FinalSummary.fixture'
import { mount } from 'enzyme'

describe('FinalSummary', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  describe('when clicking change button', () => {
    [{ className: 'select-dataset', eventString: 'selectDataset' },
      { className: 'occurrence-data', eventString: 'occurrenceData' },
      { className: 'location-data', eventString: 'locationData' },
      { className: 'observation-data', eventString: 'observationData' },
      { className: 'measurement-or-fact', eventString: 'measurementOrFact' },
      { className: 'darwin-core-fields', eventString: 'darwinCoreFields' }
    ].forEach(({ className, eventString }) => {
      it(`calls onChangeClick handler with ${eventString} when clicking change button in ${className}`, () => {
        const onChangeClick = jest.fn()
        const wrapper = mount(createComponent({ onChangeClick }))
        wrapper.find('.' + className + ' .change-button').simulate('click')
        expect(onChangeClick).toHaveBeenCalledTimes(1)
        expect(onChangeClick).toBeCalledWith(eventString)
      })
    })
  })

  describe('when clicking submit button', () => {
    it('calls onSubmitClick handler', () => {
      const onSubmitClick = jest.fn()
      const wrapper = mount(createComponent({ onSubmitClick }))
      expect(wrapper.find('.submit-entry-button .button')).toHaveLength(2)

      wrapper.find('.submit-entry-button .button').at(0).simulate('click')
      expect(onSubmitClick).toHaveBeenCalledTimes(1)

      wrapper.find('.submit-entry-button .button').at(1).simulate('click')
      expect(onSubmitClick).toHaveBeenCalledTimes(2)
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
