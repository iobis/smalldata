import 'jest-dom/extend-expect'
import Navbar from './Navbar'
import React from 'react'
import ReactDom from 'react-dom'
import renderer from 'react-test-renderer'
import TestUtils from 'react-dom/test-utils'
import { INPUT_DATA_PAGE, HELP_PAGE } from '../pages'

describe('Navbar', () => {
  it('renders correctly', () => {
    expect(renderer.create(<Navbar activePage={INPUT_DATA_PAGE}/>).toJSON()).toMatchSnapshot()
    expect(renderer.create(<Navbar activePage={HELP_PAGE}/>).toJSON()).toMatchSnapshot()
  })

  describe('when clicking navbar items', () => {
    let onChange
    let el
    let navbarItems

    beforeAll(() => {
      onChange = jest.fn()
      el = renderDom(<div><Navbar activePage={INPUT_DATA_PAGE} onPageChange={onChange}/></div>)
      navbarItems = el.querySelectorAll('.navbar-start .navbar-item')
    })

    it('renders 2 navbar items', () => {
      expect(navbarItems).toHaveLength(2)
    })

    it('does not call handler', () => {
      expect(onChange).toHaveBeenCalledTimes(0)
    })

    describe('and then clicking first navbar item', () => {
      beforeAll(() => {
        click(navbarItems[0])
      })

      it('calls handler with INPUT_DATA_PAGE', () => {
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenNthCalledWith(1, INPUT_DATA_PAGE)
      })

      describe('and then clocking second navbar item', () => {
        beforeAll(() => {
          click(navbarItems[1])
        })

        it('calls handler with HELP_PAGE', () => {
          expect(onChange).toHaveBeenCalledTimes(2)
          expect(onChange).toHaveBeenNthCalledWith(2, HELP_PAGE)
        })
      })
    })
  })
})

function renderDom(Component) {
  return ReactDom.findDOMNode(TestUtils.renderIntoDocument(Component))
}

function click(element) {
  TestUtils.Simulate.click(element)
}
