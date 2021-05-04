import { render } from '@testing-library/react'
import * as templates from './Templates'

describe('Templates', () => {
  Object.entries(templates).forEach(([key, Template]) => {
    it(`should render ${key} without failing`, () => {
      const { container } = render(
        <Template variables={[{ value: 'foo' }, { value: 'bar' }] as any} formattedValue={[]} />,
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
