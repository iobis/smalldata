import 'jest-enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

window.HTMLElement.prototype.scrollIntoView = function() {}

configure({ adapter: new Adapter() })
