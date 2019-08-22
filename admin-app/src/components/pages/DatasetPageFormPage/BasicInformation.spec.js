import BasicInformation, { languages, licences } from './BasicInformation'
import React from 'react'
import { mount } from 'enzyme'

describe('BasicInformation', () => {
  it('renders correctly', () => {
    expect(mount(
      <BasicInformation
        data={getDefaultFilledData()}
        onChange={jest.fn()}/>))
      .toMatchSnapshot()
  })

  it('returns updated title when when changing title', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <BasicInformation
        data={getDefaultFilledData()}
        onChange={onChange}/>)

    wrapper.find('.basic-information .title input').simulate('change', { target: { value: 'new-title' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, { ...getDefaultFilledData(), title: 'new-title' })
  })
})

function getDefaultFilledData() {
  return {
    title:                  'title',
    licence:                licences[0],
    language:               languages[0],
    abstract:               'abstract'
  }
}
