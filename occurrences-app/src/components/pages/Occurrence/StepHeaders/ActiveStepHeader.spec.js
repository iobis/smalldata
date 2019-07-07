import ActiveStepHeader from './ActiveStepHeader'
import React from 'react'
import { mount } from 'enzyme'

describe('ActiveStepHeader', () => {
  it('renders StepFooter with all data if next step is provided', () => {
    const wrapper = mount(
      <ActiveStepHeader
        activeStepIndex={1}
        nextStep="next step"
        onContinueButtonClick={() => {}}
        onStepTitleClick={() => {}}
        stepDescription="step description"
        stepTitle="step title"
        totalSteps={6}/>
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.step-footer').exists()).toBe(true)
    expect(wrapper.find('.step-footer .copy-previous-data').exists()).toBe(true)
    expect(wrapper.find('.step-footer .copy-previous-data').text()).toBe('occurrenceForm.copyPreviousStep')
    expect(wrapper.find('.step-footer .continue-button').exists()).toBe(true)
  })

  it('does not renders StepFooter if next step is not provided', () => {
    const wrapper = mount(
      <ActiveStepHeader
        activeStepIndex={1}
        onContinueButtonClick={() => {}}
        onStepTitleClick={() => {}}
        stepDescription="step description"
        stepTitle="step title"
        totalSteps={6}/>
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.step-footer').exists()).toBe(true)
    expect(wrapper.find('.step-footer .copy-previous-data').exists()).toBe(true)
    expect(wrapper.find('.step-footer .copy-previous-data').text()).toBe('occurrenceForm.copyPreviousStep')
    expect(wrapper.find('.step-footer .continue-button').exists()).toBe(false)
  })

  it('does not renders StepFooter if last step', () => {
    const wrapper = mount(
      <ActiveStepHeader
        activeStepIndex={6}
        onContinueButtonClick={() => {}}
        onStepTitleClick={() => {}}
        stepDescription="step description"
        stepTitle="step title"
        totalSteps={6}/>
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.step-footer').exists()).toBe(true)
    expect(wrapper.find('.step-footer .copy-previous-data').exists()).toBe(true)
    expect(wrapper.find('.step-footer .copy-previous-data').text()).toBe('occurrenceForm.copyPreviousStep')
    expect(wrapper.find('.step-footer .continue-button').exists()).toBe(false)
  })
})
