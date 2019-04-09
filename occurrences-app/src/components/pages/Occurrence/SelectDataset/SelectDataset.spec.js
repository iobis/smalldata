import React from 'react'
import renderer from 'react-test-renderer'
import SelectDataset from './SelectDataset'
import { getDatasetMock } from '../../../../clients/server'
import { mount } from 'enzyme'

describe('SelectDataset', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <SelectDataset
        datasets={getDatasetMock()}
        onChange={() => {}}
        selectedDataset={getDatasetMock()[0]}/>
    ).toJSON()).toMatchSnapshot()
  })

  it('returns selected dataset when clicking on it', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <SelectDataset
        datasets={getDatasetMock()}
        onChange={onChange}
        selectedDataset={getDatasetMock()[0]}/>)

    wrapper.find('.dataset-option input').first().simulate('change')
    expect(onChange.mock.calls.length).toBe(1)
    expect(onChange.mock.calls[0][0]).toEqual(getDatasetMock()[0])

    wrapper.find('.dataset-option input').at(1).simulate('change')
    expect(onChange.mock.calls.length).toBe(2)
    expect(onChange.mock.calls[1][0]).toEqual(getDatasetMock()[1])
  })
})
