import ContactsForm from './ContactsForm'
import React from 'react'
import { mount } from 'enzyme'

describe('ContactsForm', () => {
  let onChange
  let wrapper

  describe('returns contacts when adding to empty list', () => {
    beforeAll(() => {
      onChange = jest.fn()
      wrapper = mount(
        <ContactsForm
          className="custom-class"
          contactsTableHeader="Contacts Table Header"
          data={[]}
          onChange={onChange}/>)
    })

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('has 0 contacts', () => {
      expect(wrapper.find('.contact-row')).toHaveLength(0)
    })

    describe('and then adding name', () => {
      beforeAll(() => {
        wrapper.find('.ocean-expert-name-input .input').simulate('change', { target: { value: 'name-1' } })
        wrapper.update()
      })

      it('renders correct name', () => {
        expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('name-1')
      })

      describe('and then adding email, organization and clicking add', () => {
        beforeAll(() => {
          wrapper.find('.email input').simulate('change', { target: { value: 'email-1' } })
          wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-1' } })
          wrapper.find('.add').simulate('click')
        })

        it('renders 1 contact row', () => {
          expect(wrapper.find('.contact-row')).toHaveLength(1)
        })

        it('renres fist user', () => {
          expect(wrapper.find('.contact-row .name').text()).toEqual('name-1')
          expect(wrapper.find('.contact-row .email').text()).toEqual('email-1')
          expect(wrapper.find('.contact-row .organisation').text()).toEqual('organisation-1')
        })

        it('calls handler function with new contact', () => {
          expect(onChange).toHaveBeenCalledTimes(1)
          expect(onChange).toHaveBeenNthCalledWith(1, [{
            name:         'name-1',
            email:        'email-1',
            organisation: 'organisation-1'
          }])
        })
      })
    })
  })

  describe('returns updated contacts when adding to list with single element', () => {
    beforeAll(() => {
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
    })

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('has 1 contacts', () => {
      expect(wrapper.find('.contact-row')).toHaveLength(1)
    })

    describe('and then adding name', () => {
      beforeAll(() => {
        wrapper.find('.ocean-expert-name-input .input').simulate('change', { target: { value: 'name-2' } })
        wrapper.update()
      })

      it('renders correct name', () => {
        expect(wrapper.find('.ocean-expert-name-input .input').prop('value')).toBe('name-2')
      })

      describe('and then adding email, organization and clicking add', () => {
        beforeAll(() => {
          wrapper.find('.email input').simulate('change', { target: { value: 'email-2' } })
          wrapper.find('.organisation input').simulate('change', { target: { value: 'organisation-2' } })
          wrapper.find('.add').simulate('click')
        })

        it('renders 2 contact rows', () => {
          expect(wrapper.find('.contact-row')).toHaveLength(2)
        })

        it('renders first user at first row', () => {
          expect(wrapper.find('.contact-row .name').at(0).text()).toEqual('name-1')
          expect(wrapper.find('.contact-row .email').at(0).text()).toEqual('email-1')
          expect(wrapper.find('.contact-row .organisation').at(0).text()).toEqual('organisation-1')
        })

        it('renders second user at first row', () => {
          expect(wrapper.find('.contact-row .name').at(1).text()).toEqual('name-2')
          expect(wrapper.find('.contact-row .email').at(1).text()).toEqual('email-2')
          expect(wrapper.find('.contact-row .organisation').at(1).text()).toEqual('organisation-2')
        })

        it('calls handler function with new contact', () => {
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
      })
    })
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
