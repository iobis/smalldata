import React from 'react'
import renderer from 'react-test-renderer'
import SelectedDataset from './SelectedDataset'
import { getDatasetMock } from '../../../../clients/server'

describe('SelectedDataset', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <SelectedDataset
        datasets={getDatasetMock()}
        onChange={() => {}}
        selectedDataset={getDatasetMock()[0]}/>
    ).toJSON()).toMatchSnapshot()
  })
})
