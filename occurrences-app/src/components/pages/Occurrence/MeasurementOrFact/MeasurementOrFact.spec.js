import MeasurementOrFact from './MeasurementOrFact'
import React from 'react'
import { getData, getEmptyData, getPressureUnits } from './MeasurementOrFact.fixture'
import { mount } from 'enzyme'

jest.mock('@smalldata/dwca-lib/src/clients/measurments', () => ({
  getGeneralMeasurements:  () => (
    [{
      type:   'general-measurement-1',
      typeId: 'http://general-measurement-1/',
      units:  [
        { name: 'general-measurement-1-unit-1', id: 'http://general-measurement-1-unit-1/' },
        { name: 'general-measurement-1-unit-2', id: 'http://general-measurement-1-unit-2/' }
      ]
    }, {
      type:   'general-measurement-2',
      typeId: 'http://general-measurement-2/',
      units:  [{ name: 'general-measurement-2-unit-1', id: 'general-measurement-2-unit-1' }]
    }, {
      type:   'general-measurement-3',
      typeId: 'http://general-measurement-3/',
      units:  [{ name: 'general-measurement-3-unit-1', id: 'general-measurement-3-unit-1' }]
    }]
  ),
  getSpecificMeasurements: () => []
}))

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
        expect(onChange).toBeCalledWith([{
          type:  'general-measurement-1',
          unit:  'general-measurement-1-unit-1',
          units: getPressureUnits(),
          value: '10'
        }])
      })

      it('renders supplied value with default unit', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
        expect(wrapper.find('.supplied .fieldrow .type').text()).toBe('general-measurement-1')
        expect(wrapper.find('.supplied .fieldrow .dropdown .selected-value').text()).toBe('general-measurement-1-unit-1')
        expect(wrapper.find('.supplied .fieldrow .input').instance().value).toBe('10')
      })

      describe('and then updating value', () => {
        beforeAll(() => {
          wrapper.find('.supplied .fieldrow .input').simulate('change', { target: { value: '125' } })
        })

        it('invokes onChange with update value', () => {
          expect(onChange).toHaveBeenCalledTimes(2)
          expect(onChange).toHaveBeenNthCalledWith(2, [{
            type:  'general-measurement-1',
            unit:  'general-measurement-1-unit-1',
            units: getPressureUnits(),
            value: '125'
          }])
        })

        it('renders supplied value with updated value', () => {
          expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
          expect(wrapper.find('.supplied .fieldrow .type').text()).toBe('general-measurement-1')
          expect(wrapper.find('.supplied .fieldrow .dropdown .selected-value').text()).toBe('general-measurement-1-unit-1')
          expect(wrapper.find('.supplied .fieldrow .input').instance().value).toBe('125')
        })

        describe('and then updating unit', () => {
          beforeAll(() => {
            wrapper.find('.supplied .fieldrow .dropdown').at(0).simulate('click')
            wrapper.find('.supplied .fieldrow .dropdown-item').at(1).simulate('click')
          })

          it('invokes onChange handler with updated unit', () => {
            expect(onChange).toHaveBeenCalledTimes(3)
            expect(onChange).toHaveBeenNthCalledWith(3, [{
              type:  'general-measurement-1',
              unit:  'general-measurement-1-unit-2',
              value: '125',
              units: getPressureUnits()
            }])
          })

          it('renders supplied with updated unit', () => {
            expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
            expect(wrapper.find('.supplied .fieldrow .type').text()).toBe('general-measurement-1')
            expect(wrapper.find('.supplied .fieldrow .dropdown .selected-value').text()).toBe('general-measurement-1-unit-2')
            expect(wrapper.find('.supplied .fieldrow .input').instance().value).toBe('125')
          })

          describe('and then clicking copy', () => {
            beforeAll(() => {
              wrapper.find('.supplied .fieldrow .button.copy').at(0).simulate('click')
            })

            it('invokes onChange handler with copied measurement', () => {
              expect(onChange).toHaveBeenCalledTimes(4)
              expect(onChange).toHaveBeenNthCalledWith(4, [{
                type:  'general-measurement-1',
                unit:  'general-measurement-1-unit-2',
                value: '125',
                units: getPressureUnits()
              }, {
                type:  'general-measurement-1',
                unit:  'general-measurement-1-unit-2',
                value: '125',
                units: getPressureUnits()
              }])
            })

            it('renders 2 identical supplied measurements', () => {
              expect(wrapper.find('.supplied .fieldrow')).toHaveLength(2)
              expect(wrapper.find('.supplied .fieldrow .type').at(0).text()).toBe('general-measurement-1')
              expect(wrapper.find('.supplied .fieldrow .dropdown .selected-value').at(0).text()).toBe('general-measurement-1-unit-2')
              expect(wrapper.find('.supplied .fieldrow .input').at(0).instance().value).toBe('125')
              expect(wrapper.find('.supplied .fieldrow .type').at(1).text()).toBe('general-measurement-1')
              expect(wrapper.find('.supplied .fieldrow .dropdown .selected-value').at(1).text()).toBe('general-measurement-1-unit-2')
              expect(wrapper.find('.supplied .fieldrow .input').at(1).instance().value).toBe('125')
            })
          })
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
        expect(onChange).toBeCalledWith([{
          type:  'general-measurement-1',
          unit:  'general-measurement-1-unit-2',
          value: '20',
          units: getPressureUnits()
        }])
      })

      it('renders supplied value with selected unit', () => {
        expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
        expect(wrapper.find('.supplied .fieldrow .type').text()).toBe('general-measurement-1')
        expect(wrapper.find('.supplied .fieldrow .dropdown .selected-value').text()).toBe('general-measurement-1-unit-2')
        expect(wrapper.find('.supplied .fieldrow .input').instance().value).toBe('20')
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
        { type: 'general-measurement-1', unit: 'general-measurement-1-unit-1', value: '10', units: getPressureUnits() },
        { type: 'general-measurement-1', unit: 'general-measurement-1-unit-1', value: '20', units: getPressureUnits() },
        { type: 'general-measurement-1', unit: 'general-measurement-1-unit-1', value: '30', units: getPressureUnits() }
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
        expect(onChange).toHaveBeenNthCalledWith(4, [{
          type:  'general-measurement-1',
          unit:  'general-measurement-1-unit-1',
          value: '20',
          units: getPressureUnits()
        }, {
          type:  'general-measurement-1',
          unit:  'general-measurement-1-unit-1',
          value: '30',
          units: getPressureUnits()
        }])
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
          expect(onChange).toHaveBeenNthCalledWith(5, [{
            type:  'general-measurement-1',
            unit:  'general-measurement-1-unit-1',
            value: '20',
            units: getPressureUnits()
          }])
        })

        it('renders 1 measurements', () => {
          expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
          expect(wrapper.find('.supplied .fieldrow').map(suppliedMeasurementValue)).toEqual(['20'])
        })
      })
    })
  })

  describe('when adding measurement by pressing Enter key', () => {
    beforeAll(() => {
      wrapper = mount(createComponent({ onChange }))
      wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: '123' } })
      wrapper.find('.general .measurement-row .input').at(0).simulate('keydown', { key: 'Enter' })
    })

    afterAll(() => {
      onChange.mockReset()
    })

    it('invokes onChange handler', () => {
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenNthCalledWith(1, [{
        type:  'general-measurement-1',
        unit:  'general-measurement-1-unit-1',
        value: '123',
        units: getPressureUnits()
      }])
    })
  })

  it('updates values when updates props', () => {
    wrapper = mount(createComponent())
    expect(wrapper.find('.supplied .fieldrow')).toHaveLength(0)

    wrapper.setProps({ data: getData() })
    wrapper.update()
    expect(wrapper.find('.supplied .fieldrow')).toHaveLength(1)
  })

  function addGeneralMeasurement(value) {
    wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value } })
    wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
  }
})

const suppliedMeasurementValue = el => el.find('.input').instance().value

function createComponent(props) {
  const defaultProps = {
    data:     getEmptyData(),
    onChange: jest.fn()
  }
  return <MeasurementOrFact {...defaultProps} {...props}/>
}
