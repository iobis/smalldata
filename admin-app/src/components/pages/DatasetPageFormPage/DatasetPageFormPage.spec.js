import DatasetPageFormPage from './DatasetPageFormPage'
import React from 'react'
import { mount } from 'enzyme'

describe('DatasetPageFormPage', () => {
  it('renders correctly', () => {
    const wrapper = mount(<DatasetPageFormPage/>)
    expect(wrapper).toMatchSnapshot()

    addBasicData(wrapper)
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-2 .step-header').simulate('click')
    expect(wrapper.find('.step-header .selected-data').at(0).text()).toEqual('dataset title')
  })

  function addBasicData(wrapper) {
    wrapper.find('.basic-information .title input')
      .simulate('change', { target: { value: 'dataset title' } })
    wrapper.find('.basic-information .publishing-organisation input')
      .simulate('change', { target: { value: 'dataset publishing organisation' } })
    wrapper.find('.basic-information .licence .dropdown').simulate('click')
    wrapper.find('.basic-information .licence .dropdown .dropdown-item').at(1).simulate('click')
    wrapper.find('.basic-information .language .dropdown').simulate('click')
    wrapper.find('.basic-information .language .dropdown .dropdown-item').at(1).simulate('click')
    wrapper.find('.basic-information .abstract textarea')
      .simulate('change', { target: { value: 'dataset abstract information' } })
  }
})
