import ConfirmedStepHeader from './ConfirmedStepHeader'
import React from 'react'
import renderer from 'react-test-renderer'

describe('ActiveStepHeader', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <ConfirmedStepHeader
        dataDescription="data description"
        onStepTitleClick={() => {}}
        selectedData="selected data"
        stepDescription="step description"
        stepTitle="step title"/>
    ).toJSON()).toMatchSnapshot()
  })
})
