import ActiveStepHeader from './ActiveStepHeader'
import React from 'react'
import renderer from 'react-test-renderer'

describe('ActiveStepHeader', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <ActiveStepHeader
        onStepTitleClick={() => {}}
        stepDescription="step description"
        stepTitle="step title"/>
    ).toJSON()).toMatchSnapshot()
  })
})
