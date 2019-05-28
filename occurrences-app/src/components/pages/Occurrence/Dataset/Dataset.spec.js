import React from 'react'
import Dataset from './Dataset'
import { getDatasetMock } from '../../../../clients/server'
import { mount } from 'enzyme'

describe('Dataset', () => {
  it('renders correctly', () => {
    expect(mount(
      <Dataset
        datasets={getDatasetMock()}
        onChange={() => {}}
        selectedDataset={getDatasetMock()[0]}/>
    )).toMatchSnapshot()
  })

  it('returns selected dataset when clicking on it', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <Dataset
        datasets={getDatasetMock()}
        onChange={onChange}
        selectedDataset={getDatasetMock()[0]}/>)

    wrapper.find('.dataset-option input').at(0).simulate('change')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, getDatasetMock()[0])

    wrapper.find('.dataset-option input').at(1).simulate('change')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(2, getDatasetMock()[1])

    wrapper.find('.dataset-option').at(2).simulate('click')
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenNthCalledWith(3, getDatasetMock()[2])
  })
})
