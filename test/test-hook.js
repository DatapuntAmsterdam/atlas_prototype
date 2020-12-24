import { mount } from 'enzyme'

const TestHook = ({ callback }) => {
  callback()
  return null
}

const testHook = (callback) => {
  mount(<TestHook callback={callback} />)
}

export default testHook
