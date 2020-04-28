import React from 'react'
import { mount, shallow } from 'enzyme'

import AutoSuggest from './AutoSuggest'
import { MORE_RESULTS_INDEX } from './AutoSuggestCategory'

jest.mock('../../../app/pages/SearchPage/config', () => ({
  TYPES: {
    DATA: 'data',
  },
}))

jest.mock('./Search', () => () => (
  <div>
    <input type="text" id="auto-suggest__input" />
  </div>
))

const mockFilledState = {
  suggestions: [
    {
      content: [
        {
          uri: 'bag/openbareruimte/03630000003186/',
          label: 'Dam',
          index: 0,
          category: 'Straatnamen',
          type: 'data',
        },
        {
          uri: 'bag/openbareruimte/03630000001038/',
          label: 'Damloperspad',
          index: 1,
          category: 'Straatnamen',
          type: 'data',
        },
        {
          uri: 'bag/openbareruimte/03630000003187/',
          label: 'Damrak',
          index: 2,
          category: 'Straatnamen',
          type: 'data',
        },
      ],
      label: 'Straatnamen',
      type: 'data',
      total_results: 6,
    },
    {
      content: [
        {
          uri: 'monumenten/monumenten/8e8ae1dd-78a2-4a5f-841d-1870631b7e33/',
          label: 'Damrak 1',
          index: 3,
          category: 'Monumenten',
          type: 'data',
        },
        {
          uri: 'monumenten/monumenten/aa3f9081-2ac4-49ea-95d2-0aad7aecd883/',
          label: 'Dam 10',
          index: 4,
          category: 'Monumenten',
          type: 'data',
        },
        {
          uri: 'monumenten/monumenten/f93e31ba-89eb-4784-87e1-d32c33b5236d/',
          label: 'Damrak 15',
          index: 5,
          category: 'Monumenten',
          type: 'data',
        },
      ],
      label: 'Monumenten',
      total_results: 5,
      type: 'data',
    },
  ],
  typedQuery: 'dam',
  numberOfSuggestions: 6,
  isDatasetView: false,
  activeSuggestion: {
    uri: 'monumenten/monumenten/8e8ae1dd-78a2-4a5f-841d-1870631b7e33/',
    label: 'Damrak 1',
    index: 3,
    category: 'Monumenten',
    type: 'data',
  },
}
const onInputEvent = { currentTarget: { value: 'd' }, persist: jest.fn() }

const onSubmit = jest.fn()
const onSuggestionActivate = jest.fn()
const onSuggestionSelection = jest.fn()
const onTextInput = jest.fn()

describe('The AutoSuggest component', () => {
  it('shows a legend if a title is provided', () => {
    const legendTitle = 'title'
    const autoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
        legendTitle={legendTitle}
      />,
    )
    const legend = autoSuggestComponent.find('legend')
    expect(legend.text()).toBe(legendTitle)
  })

  it('optionally fills the searchbox with a query', () => {
    // Without a query
    const autoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
      />,
    )
    expect(autoSuggestComponent.instance().props.query).toBe('')

    // With a query
    const prefilledAutoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
      />,
      { disableLifecycleMethods: false },
    )

    // trigger the componentDidUpdate method
    prefilledAutoSuggestComponent.setProps({
      query: mockFilledState.typedQuery,
    })
    prefilledAutoSuggestComponent.update()

    expect(prefilledAutoSuggestComponent.instance().props.query).toBe('dam')
  })

  it('should call the prop function "onTextInput" on text input', () => {
    const autoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
      />,
    )

    autoSuggestComponent.instance().onInput(onInputEvent)

    expect(onTextInput).toHaveBeenCalled()
  })

  it('should toggle the "showsuggestions" state on focus and blur of the input field', () => {
    jest.useFakeTimers()
    const autoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
        suggestions={mockFilledState.suggestions}
      />,
      { disableLifecycleMethods: false },
    )

    // trigger the componentDidUpdate method
    autoSuggestComponent.setProps({ query: mockFilledState.typedQuery })
    autoSuggestComponent.update()

    const inputField = autoSuggestComponent.find('input#auto-suggest__input')

    expect(autoSuggestComponent).toMatchSnapshot()
    inputField.simulate('focus')
    autoSuggestComponent.update()
    expect(autoSuggestComponent).toMatchSnapshot()
    inputField.simulate('blur')
    autoSuggestComponent.update()
    jest.runAllTimers()
    autoSuggestComponent.update()
    expect(autoSuggestComponent).toMatchSnapshot()
  })

  it('should allow the user to navigate with the keyboard', () => {
    const autoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
        suggestions={mockFilledState.suggestions}
        query={mockFilledState.typedQuery}
        numberOfSuggestions={mockFilledState.numberOfSuggestions}
      />,
    )

    const inputField = autoSuggestComponent.find('input#auto-suggest__input')
    inputField.simulate('focus')
    expect(autoSuggestComponent).toMatchSnapshot()
    inputField.simulate('keydown', {
      target: {
        keyCode: 40,
        which: 40,
        key: 'down arrow',
        metaKey: false,
        ctrlKey: false,
        altKey: false,
      },
    })
    autoSuggestComponent.setProps({
      activeSuggestion: mockFilledState.activeSuggestion,
      highlightQuery: mockFilledState.typedQuery,
    })
    autoSuggestComponent.update()
    expect(autoSuggestComponent).toMatchSnapshot()
  })

  it('should trigger the onTextInput prop on focus when there is a query but no suggestions', () => {
    const autoSuggestComponent = mount(
      <AutoSuggest
        activeSuggestion={{ index: -1 }}
        onSubmit={onSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={onSuggestionSelection}
        onTextInput={onTextInput}
        suggestions={[]}
      />,
      { disableLifecycleMethods: false },
    )

    // trigger the componentDidUpdate method
    autoSuggestComponent.setProps({ query: mockFilledState.typedQuery })
    autoSuggestComponent.instance().onFocus()
    expect(onTextInput).toHaveBeenCalled()
  })

  describe('onFormSubmit', () => {
    it('should be triggered when an ellipsis list item is selected', () => {
      const autoSuggestComponent = shallow(
        <AutoSuggest
          activeSuggestion={mockFilledState.activeSuggestion}
          onSubmit={onSubmit}
          onSuggestionActivate={onSuggestionActivate}
          onSuggestionSelection={onSuggestionSelection}
          onTextInput={onTextInput}
        />,
      )

      const suggestion = { index: MORE_RESULTS_INDEX, type: 'some type' }
      const event = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      }
      autoSuggestComponent.instance().onFormSubmit = jest.fn()
      autoSuggestComponent.instance().onSuggestionSelection(suggestion, event)
      expect(autoSuggestComponent.instance().onFormSubmit).toHaveBeenCalledWith(event, 'some type')
    })
  })

  describe('resetActiveSuggestion', () => {
    it('should be triggered if user is typing and there is a suggestion available', () => {
      // Without a query
      const autoSuggestComponent = mount(
        <AutoSuggest
          activeSuggestion={mockFilledState.activeSuggestion}
          onSubmit={onSubmit}
          onSuggestionActivate={onSuggestionActivate}
          onSuggestionSelection={onSuggestionSelection}
          onTextInput={onTextInput}
        />,
      )

      autoSuggestComponent.instance().resetActiveSuggestion = jest.fn()

      autoSuggestComponent.instance().onInput(onInputEvent)

      expect(autoSuggestComponent.instance().resetActiveSuggestion).toHaveBeenCalled()
    })
  })

  describe('navigateSuggestions keydown events', () => {
    let autoSuggestComponent

    beforeEach(() => {
      autoSuggestComponent = mount(
        <AutoSuggest
          activeSuggestion={{ index: 0 }}
          onSubmit={onSubmit}
          onSuggestionActivate={onSuggestionActivate}
          onSuggestionSelection={onSuggestionSelection}
          onTextInput={onTextInput}
          numberOfSuggestions={1}
        />,
      )

      onSuggestionActivate.mockClear()
      autoSuggestComponent.instance().resetActiveSuggestion = jest.fn()
      autoSuggestComponent.instance().onSuggestionSelection = jest.fn()
    })

    it('should handle arrow up key', () => {
      const preventDefaultMock = jest.fn()
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 38,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).toHaveBeenCalled()
      expect(onSuggestionActivate).not.toHaveBeenCalled()

      autoSuggestComponent.setState({ showSuggestions: true })

      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 38,
        preventDefault: preventDefaultMock,
      })

      expect(onSuggestionActivate).toHaveBeenCalled()
      onSuggestionActivate.mockRestore()
    })

    it('should handle down up key', () => {
      const preventDefaultMock = jest.fn()
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 40,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).not.toHaveBeenCalled()
      expect(onSuggestionActivate).not.toHaveBeenCalled()

      autoSuggestComponent.setState({ showSuggestions: true })
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 40,
        preventDefault: preventDefaultMock,
      })

      expect(onSuggestionActivate).toHaveBeenCalled()
    })

    it('should handle escape key', () => {
      const preventDefaultMock = jest.fn()
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 27,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).not.toHaveBeenCalled()
      expect(autoSuggestComponent.instance().resetActiveSuggestion).toHaveBeenCalled()
    })

    it('should handle enter key', () => {
      const preventDefaultMock = jest.fn()
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 13,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).not.toHaveBeenCalled()
      expect(autoSuggestComponent.instance().onSuggestionSelection).toHaveBeenCalled()
    })

    it('should not handle enter key when index for suggestions is below 0', () => {
      const preventDefaultMock = jest.fn()
      autoSuggestComponent.setProps({ activeSuggestion: { index: -1 } })
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 13,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).not.toHaveBeenCalled()
      expect(autoSuggestComponent.instance().onSuggestionSelection).not.toHaveBeenCalled()
    })

    it('should handle any other key and do nothing', () => {
      const preventDefaultMock = jest.fn()
      autoSuggestComponent.instance().navigateSuggestions({
        keyCode: 44,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).not.toHaveBeenCalled()
    })
  })
})
