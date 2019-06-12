import React from 'react'
import Dataset from './Dataset'
import { RESPONSE_DEFAULT } from '../../../../clients/SmalldataClient.mock'
import { renameRefToId } from '../../../../clients/SmalldataClient'
import { mount } from 'enzyme'

describe('Dataset', () => {
  it('renders correctly', () => {
    expect(mount(
      <Dataset
        datasets={getDefaultDatasets()}
        onChange={() => {}}
        selectedDataset={getDefaultDatasets()[0]}/>
    )).toMatchSnapshot()
  })

  it('returns selected dataset when clicking on it', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <Dataset
        datasets={getDefaultDatasets()}
        onChange={onChange}
        selectedDataset={getDefaultDatasets()[0]}/>)

    wrapper.find('.dataset-option input').at(0).simulate('change')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, getDefaultDatasets()[0])

    wrapper.find('.dataset-option input').at(1).simulate('change')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(2, getDefaultDatasets()[1])

    wrapper.find('.dataset-option').at(2).simulate('click')
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenNthCalledWith(3, getDefaultDatasets()[2])
  })
})

function getDefaultDatasets() {
  return RESPONSE_DEFAULT.map(renameRefToId)
}
