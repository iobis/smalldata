import NotConfirmedStepHeader from './NotConfirmedStepHeader'
import React from 'react'
import renderer from 'react-test-renderer'

describe('NotConfirmedStepHeader', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <NotConfirmedStepHeader
        onStepTitleClick={() => {}}
        stepDescription="step description"
        stepTitle="step title"/>
    ).toJSON()).toMatchSnapshot()
  })
})
