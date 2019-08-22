import BasicInformation, { languages } from './BasicInformation'
import React from 'react'
import { licences } from '@smalldata/dwca-lib/src/clients/licences'
import { mount } from 'enzyme'

describe('BasicInformation', () => {
  it('renders correctly', () => {
    expect(mount(
      <BasicInformation
        data={getDefaultFilledData()}
        licences={licences.map(licence => licence.title)}
        onChange={jest.fn()}/>))
      .toMatchSnapshot()
  })

  it('returns updated title when when changing title', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <BasicInformation
        data={getDefaultFilledData()}
        licences={licences.map(licence => licence.title)}
        onChange={onChange}/>)

    wrapper.find('.basic-information .title input').simulate('change', { target: { value: 'new-title' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, { ...getDefaultFilledData(), title: 'new-title' })
  })
})

function getDefaultFilledData() {
  return {
    title:    'title',
    licence:  licences[0].title,
    language: languages[0],
    abstract: 'abstract'
  }
}
