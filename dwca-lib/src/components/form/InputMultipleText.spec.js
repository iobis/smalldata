import InputMultipleText from './InputMultipleText'
import React from 'react'
import { mount } from 'enzyme'

describe('InputMultipleText', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })

  it('renders correctly when providing custom labelComponent', () => {
    expect(mount(createComponent({
      labelComponent: (item) => <a href={item}>item</a>
    }))).toMatchSnapshot()
  })

  it('adds new item when clicking Enter', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    expect(wrapper.find('.tag')).toHaveLength(2)

    wrapper.find('input').simulate('change', { target: { value: 'new text value' } })
    expect(wrapper.find('.tag')).toHaveLength(2)
    expect(onChange).toHaveBeenCalledTimes(0)

    wrapper.find('input').simulate('keydown', { key: 'Enter' })
    expect(wrapper.find('.tag')).toHaveLength(3)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith(['value-1', 'value-2', 'new text value'])
  })

  it('removes item when clicking delete icon', () => {
    const onChange = jest.fn()
    const wrapper = mount(createComponent({ onChange }))
    expect(wrapper.find('.tag')).toHaveLength(2)

    wrapper.find('.tag .delete').first().simulate('click')
    expect(wrapper.find('.tag')).toHaveLength(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toBeCalledWith(['value-2'])
  })

  it('updates values when updates props', () => {
    const wrapper = mount(createComponent({ values: [] }))
    expect(wrapper.find('.tag')).toHaveLength(0)

    wrapper.setProps({ values: ['value-3', 'value-4'] })
    wrapper.update()
    expect(wrapper.find('.tag')).toHaveLength(2)
  })
})

function createComponent(props) {
  const defaultProps = {
    className: 'custom-class-name',
    name:      'field-name',
    onChange:  jest.fn(),
    values:    ['value-1', 'value-2']
  }
  return <InputMultipleText {...defaultProps} {...props}/>
}
