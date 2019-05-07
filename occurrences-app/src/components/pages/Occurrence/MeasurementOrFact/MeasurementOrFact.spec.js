import MeasurementOrFact from './MeasurementOrFact'
import React from 'react'
import { getEmptyData } from './MeasurementOrFact.fixture'
import { mount } from 'enzyme'

describe('MeasurementOrFact', () => {
  let wrapper

  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  describe('when adding measurement with default unit', () => {
    beforeAll(() => {
      wrapper = mount(createComponent())
    })

    it('does not render any supplied measurements', () => {
      expect(wrapper.find('.supplied .fieldrow')).toHaveLength(0)
    })

    describe('and then changing unit and adding measurement', () => {
      beforeAll(() => {
        wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: '10' } })
        wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
      })

      it('renders supplied value with default unit', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
        expect(wrapper.find('.supplied .fieldrow td').at(0).text()).toBe('Pressure')
        expect(wrapper.find('.supplied .fieldrow td').at(1).text()).toBe('Kilogram')
        expect(wrapper.find('.supplied .fieldrow td').at(2).text()).toBe('10')
      })
    })
  })

  describe('when adding measurement with updated unit', () => {
    beforeAll(() => {
      wrapper = mount(createComponent())
    })

    it('does not render any supplied measurements', () => {
      expect(wrapper.find('.supplied .fieldrow')).toHaveLength(0)
    })

    describe('and then changing unit and adding measurement', () => {
      beforeAll(() => {
        wrapper.find('.general .measurement-row .dropdown').at(0).simulate('click')
        wrapper.find('.general .measurement-row .dropdown-item').at(1).simulate('click')
        wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: '20' } })
        wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
      })

      it('renders supplied value with selected unit', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
        expect(wrapper.find('.supplied .fieldrow td').at(0).text()).toBe('Pressure')
        expect(wrapper.find('.supplied .fieldrow td').at(1).text()).toBe('Gram')
        expect(wrapper.find('.supplied .fieldrow td').at(2).text()).toBe('20')
      })
    })
  })
})

function createComponent(props) {
  const defaultProps = {
    data:     getEmptyData(),
    onChange: jest.fn()
  }
  return <MeasurementOrFact {...defaultProps} {...props}/>
}
