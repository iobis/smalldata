import ContactsForm from './ContactsForm'
import React from 'react'
import { mount } from 'enzyme'

describe('ContactsForm', () => {
  let onChange
  let wrapper

  it('returns contacts when adding to empty list', () => {
    onChange = jest.fn()
    wrapper = mount(
      <ContactsForm
        className="custom-class"
        contactsTableHeader="Contacts Table Header"
        data={[]}
        onChange={onChange}/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.contact-row')).toHaveLength(0)

    wrapper.find('.name input').simulate('change', { target: { value: 'name-1' } })
    wrapper.find('.email input').simulate('change', { target: { value: 'email-1' } })
    wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-1' } })
    wrapper.find('.add').simulate('click')
    expect(wrapper.find('.contact-row')).toHaveLength(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, [{
      name:         'name-1',
      email:        'email-1',
      organisation: 'organisation-1'
    }])
  })

  it('returns updated contacts when adding to list with single element', () => {
    onChange = jest.fn()
    wrapper = mount(
      <ContactsForm
        className="custom-class"
        contactsTableHeader="Contacts Table Header"
        data={[{
          name:         'name-1',
          email:        'email-1',
          organisation: 'organisation-1'
        }]}
        onChange={onChange}/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.contact-row')).toHaveLength(1)

    wrapper.find('.name input').simulate('change', { target: { value: 'name-2' } })
    wrapper.find('.email input').simulate('change', { target: { value: 'email-2' } })
    wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-2' } })
    wrapper.find('.add').simulate('click')
    expect(wrapper.find('.contact-row')).toHaveLength(2)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, [{
      name:         'name-1',
      email:        'email-1',
      organisation: 'organisation-1'
    }, {
      name:         'name-2',
      email:        'email-2',
      organisation: 'organisation-2'
    }])
  })

  describe('when removing contacts', () => {
    const data = [{
      name:         'name-1',
      email:        'email-1',
      organisation: 'organisation-1'
    }, {
      name:         'name-2',
      email:        'email-2',
      organisation: 'organisation-2'
    }]

    it('removes first contact', () => {
      onChange = jest.fn()
      wrapper = mount(
        <ContactsForm
          contactsTableHeader="Contacts Table Header"
          data={data}
          onChange={onChange}/>)
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.find('.contact-row')).toHaveLength(2)
      expect(wrapper.find('.contact-row .remove')).toHaveLength(2)

      wrapper.find('.contact-row .remove').at(0).simulate('click')
      expect(wrapper.find('.contact-row')).toHaveLength(1)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenNthCalledWith(1, [data[1]])
    })

    it('removes second contact', () => {
      onChange = jest.fn()
      wrapper = mount(
        <ContactsForm
          contactsTableHeader="Contacts Table Header"
          data={data}
          onChange={onChange}/>)
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.find('.contact-row')).toHaveLength(2)
      expect(wrapper.find('.contact-row .remove')).toHaveLength(2)

      wrapper.find('.contact-row .remove').at(1).simulate('click')
      expect(wrapper.find('.contact-row')).toHaveLength(1)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenNthCalledWith(1, [data[0]])
    })
  })
})
