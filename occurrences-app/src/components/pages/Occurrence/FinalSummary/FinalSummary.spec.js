import FinalSummary from './FinalSummary'
import React from 'react'
import { getDefaultProps } from './FinalSummary.fixture'
import { mount } from 'enzyme'

describe('FinalSummary', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  describe('when clicking change button', () => {
    [{ className: 'dataset-summary', params: { index: 0, value: 'dataset' } },
      { className: 'occurrence-data-summary', params: { index: 1, value: 'occurrenceData' } },
      { className: 'location-data-summary', params: { index: 2, value: 'locationData' } },
      { className: 'observation-data-summary', params: { index: 3, value: 'observationData' } },
      { className: 'measurement-or-fact-summary', params: { index: 4, value: 'measurementOrFact' } },
      { className: 'darwin-core-fields-summary', params: { index: 5, value: 'darwinCoreFields' } }
    ].forEach(({ className, params }) => {
      it(`calls onChangeClick handler with ${params.value} when clicking change button in ${className}`, () => {
        const onChangeClick = jest.fn()
        const wrapper = mount(createComponent({ onChangeClick }))
        wrapper.find('.' + className + ' .change-button').simulate('click')
        expect(onChangeClick).toHaveBeenCalledTimes(1)
        expect(onChangeClick).toBeCalledWith(params)
      })
    })
  })

  describe('when clicking submit button', () => {
    it('calls onSubmitClick handler', () => {
      const onSubmitClick = jest.fn()
      const wrapper = mount(createComponent({ onSubmitClick }))
      expect(wrapper.find('.submit-entry-button .button')).toHaveLength(1)

      wrapper.find('.submit-entry-button .button').at(0).simulate('click')
      expect(onSubmitClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when rendering component with error message', () => {
    it('calls onSubmitClick handler', () => {
      const onErrorClose = jest.fn()
      const wrapper = mount(createComponent({ onErrorClose, errorVisible: true, errorMessage: 'error message' }))
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.find('.error-message').exists()).toBe(true)

      wrapper.find('.error-message .close').simulate('click')
      expect(onErrorClose).toHaveBeenCalledTimes(1)
    })
  })
})

function createComponent(props) {
  const defaultProps = {
    ...getDefaultProps(),
    onChangeClick: jest.fn(),
    onErrorClose:  jest.fn(),
    onSubmitClick: jest.fn()
  }

  return <FinalSummary {...defaultProps} {...props}/>
}
