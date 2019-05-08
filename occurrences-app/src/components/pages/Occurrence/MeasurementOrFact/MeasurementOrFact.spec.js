import MeasurementOrFact from './MeasurementOrFact'
import React from 'react'
import { getEmptyData } from './MeasurementOrFact.fixture'
import { mount } from 'enzyme'

describe('MeasurementOrFact', () => {
  const onChange = jest.fn()
  let wrapper

  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  describe('when adding measurement with default unit', () => {
    beforeAll(() => {
      wrapper = mount(createComponent({ onChange }))
    })

    afterAll(() => {
      onChange.mockReset()
    })

    it('does not render any supplied measurements', () => {
      expect(wrapper.find('.supplied .fieldrow')).toHaveLength(0)
    })

    describe('and then changing unit and adding measurement', () => {
      beforeAll(() => {
        addGeneralMeasurement('10')
      })

      it('invokes onChange handler', () => {
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toBeCalledWith([{ type: 'Pressure', unit: 'Kilogram', value: '10' }])
      })

      it('renders supplied value with default unit', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
        expect(wrapper.find('.supplied .fieldrow td').at(0).text()).toBe('Pressure')
        expect(wrapper.find('.supplied .fieldrow td').at(1).text()).toBe('Kilogram')
        expect(wrapper.find('.supplied .fieldrow td .input').instance().value).toBe('10')
      })

      describe('and then updating value', () => {
        beforeAll(() => {
          wrapper.find('.supplied .fieldrow td .input').simulate('change', { target: { value: '125' } })
        })

        it('invokes onChange handler', () => {
          expect(onChange).toHaveBeenCalledTimes(2)
          expect(onChange).toHaveBeenNthCalledWith(2, [
            { type: 'Pressure', unit: 'Kilogram', value: '125' }
          ])
        })

        it('renders supplied value with default unit', () => {
          expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
          expect(wrapper.find('.supplied .fieldrow td').at(0).text()).toBe('Pressure')
          expect(wrapper.find('.supplied .fieldrow td').at(1).text()).toBe('Kilogram')
          expect(wrapper.find('.supplied .fieldrow td .input').instance().value).toBe('125')
        })
      })
    })
  })

  describe('when adding measurement with updated unit', () => {
    beforeAll(() => {
      wrapper = mount(createComponent({ onChange }))
    })

    afterAll(() => {
      onChange.mockReset()
    })

    it('does not render any supplied measurements', () => {
      expect(wrapper.find('.supplied .fieldrow')).toHaveLength(0)
    })

    describe('and then changing unit and adding measurement', () => {
      beforeAll(() => {
        wrapper.find('.general .measurement-row .dropdown').at(0).simulate('click')
        wrapper.find('.general .measurement-row .dropdown-item').at(1).simulate('click')
        addGeneralMeasurement('20')
      })

      it('invokes onChange handler', () => {
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toBeCalledWith([{ type: 'Pressure', unit: 'Gram', value: '20' }])
      })

      it('renders supplied value with selected unit', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
        expect(wrapper.find('.supplied .fieldrow td').at(0).text()).toBe('Pressure')
        expect(wrapper.find('.supplied .fieldrow td').at(1).text()).toBe('Gram')
        expect(wrapper.find('.supplied .fieldrow td .input').instance().value).toBe('20')
      })
    })
  })

  describe('when adding multiple measurements', () => {
    beforeAll(() => {
      wrapper = mount(createComponent({ onChange }))
      addGeneralMeasurement('10')
      addGeneralMeasurement('20')
      addGeneralMeasurement('30')
    })

    afterAll(() => {
      onChange.mockReset()
    })

    it('invokes onChange handler', () => {
      expect(onChange).toHaveBeenCalledTimes(3)
      expect(onChange).toHaveBeenNthCalledWith(3, [
        { type: 'Pressure', unit: 'Kilogram', value: '10' },
        { type: 'Pressure', unit: 'Kilogram', value: '20' },
        { type: 'Pressure', unit: 'Kilogram', value: '30' }
      ])
    })

    it('renders 3 measurements', () => {
      expect(wrapper.find('.supplied .fieldrow')).toHaveLength(3)
      expect(wrapper.find('.supplied .fieldrow').map(suppliedMeasurementValue)).toEqual(['10', '20', '30'])
    })

    describe('and then removing first one', () => {
      beforeAll(() => {
        wrapper.find('.supplied .button.remove').first().simulate('click')
      })

      it('invokes onChange handler', () => {
        expect(onChange).toHaveBeenCalledTimes(4)
        expect(onChange).toHaveBeenNthCalledWith(4, [
          { type: 'Pressure', unit: 'Kilogram', value: '20' },
          { type: 'Pressure', unit: 'Kilogram', value: '30' }
        ])
      })

      it('renders 2 measurements', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(2)
        expect(wrapper.find('.supplied .fieldrow').map(suppliedMeasurementValue)).toEqual(['20', '30'])
      })

      describe('and then removing last one', () => {
        beforeAll(() => {
          wrapper.find('.supplied .button.remove').last().simulate('click')
        })

        it('invokes onChange handler', () => {
          expect(onChange).toHaveBeenCalledTimes(5)
          expect(onChange).toHaveBeenNthCalledWith(5, [
            { type: 'Pressure', unit: 'Kilogram', value: '20' }
          ])
        })

        it('renders 1 measurements', () => {
          expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
          expect(wrapper.find('.supplied .fieldrow').map(suppliedMeasurementValue)).toEqual(['20'])
        })
      })
    })
  })

  function addGeneralMeasurement(value) {
    wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value } })
    wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
  }
})

const suppliedMeasurementValue = el => el.find('td .input').instance().value

function createComponent(props) {
  const defaultProps = {
    data:     getEmptyData(),
    onChange: jest.fn()
  }
  return <MeasurementOrFact {...defaultProps} {...props}/>
}
