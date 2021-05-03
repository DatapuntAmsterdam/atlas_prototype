import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import useParam from '../../utils/useParam'
import { UiProvider, useIsEmbedded } from './UiContext'

jest.mock('../../utils/useParam')

const useParamMock = mocked(useParam)

describe('UiContext', () => {
  afterEach(() => {
    useParamMock.mockClear()
  })

  it('provides the embed state', () => {
    useParamMock.mockReturnValue([false, () => {}])

    const TestFalse = () => {
      expect(useIsEmbedded()).toEqual(false)
      return null
    }

    render(
      <UiProvider>
        <TestFalse />
      </UiProvider>,
    )

    useParamMock.mockReturnValue([true, () => {}])

    const TestTrue = () => {
      expect(useIsEmbedded()).toEqual(true)
      return null
    }

    render(
      <UiProvider>
        <TestTrue />
      </UiProvider>,
    )
  })
})
