import ContactsForm from './ContactsForm'
import React from 'react'
import { mount } from 'enzyme'

describe('ContactsForm', () => {
  it('returns contacts when adding', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <ContactsForm
        data={[]}
        onChange={onChange}/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.contact-row')).toHaveLength(0)

    wrapper.find('.name input').simulate('change', { target: { value: 'name-1' } })
    wrapper.find('.email input').simulate('change', { target: { value: 'email-1' } })
    wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-1' } })
    wrapper.find('.position input').simulate('change', { target: { value: 'position-1' } })
    wrapper.find('.add').simulate('click')
    expect(wrapper.find('.contact-row')).toHaveLength(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, [{
      name:         'name-1',
      email:        'email-1',
      organisation: 'organisation-1',
      position:     'position-1'
    }])
  })

  it('returns updated contacts when when adding', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <ContactsForm
        data={[{
          name:         'name-1',
          email:        'email-1',
          organisation: 'organisation-1',
          position:     'position-1'
        }]}
        onChange={onChange}/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.contact-row')).toHaveLength(1)

    wrapper.find('.name input').simulate('change', { target: { value: 'name-2' } })
    wrapper.find('.email input').simulate('change', { target: { value: 'email-2' } })
    wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-2' } })
    wrapper.find('.position input').simulate('change', { target: { value: 'position-2' } })
    wrapper.find('.add').simulate('click')
    expect(wrapper.find('.contact-row')).toHaveLength(2)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, [{
      name:         'name-1',
      email:        'email-1',
      organisation: 'organisation-1',
      position:     'position-1'
    }, {
      name:         'name-2',
      email:        'email-2',
      organisation: 'organisation-2',
      position:     'position-2'
    }])
  })
})
