import DatasetPageFormPage from './DatasetPageFormPage'
import React from 'react'
import { mount } from 'enzyme'

describe('DatasetPageFormPage', () => {
  it('renders correctly', () => {
    expect(mount(<DatasetPageFormPage/>)).toMatchSnapshot()
  })
})
