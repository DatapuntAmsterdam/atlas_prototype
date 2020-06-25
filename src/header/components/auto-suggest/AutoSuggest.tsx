import React, { useState } from 'react'
import AutoSuggestCategory, { MORE_RESULTS_INDEX } from './AutoSuggestCategory'
import Search from './Search'

type Suggestion = {
  category: string
  index: number
  label: string
  uri: string
  type: string
}

type SuggestionList = Array<{
  label: string
  // eslint-disable-next-line camelcase
  total_results: number
  content: Array<Suggestion>
  type: string
}>

type AutoSuggestProps = {
  activeSuggestion: Suggestion
  highlightQuery?: string
  legendTitle?: string
  numberOfSuggestions?: number
  onSubmit: Function
  onSuggestionActivate: Function
  onSuggestionSelection: Function
  onTextInput: Function
  placeHolder?: string
  query?: string
  suggestions?: SuggestionList
}

const getSuggestionByIndex = (searchResults: SuggestionList, suggestionIndex: number) =>
  searchResults
    .reduce<Array<Suggestion>>((flatResults, category) => [...flatResults, ...category.content], [])
    .find((flatSuggestion) => flatSuggestion.index === suggestionIndex)

const AutoSuggest: React.FC<AutoSuggestProps> = ({
  activeSuggestion,
  onSuggestionActivate,
  onSubmit,
  onSuggestionSelection,
  onTextInput,
  highlightQuery = '',
  legendTitle = '',
  numberOfSuggestions = 0,
  placeHolder = '',
  query = '',
  suggestions = [],
}) => {
  const [openSearchBarToggle, setOpenSearchBarToggle] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  function onBlur() {
    setTimeout(() => {
      setShowSuggestions(false)
      setOpenSearchBarToggle(false)
    }, 200)
  }

  function onInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (activeSuggestion.index > -1) {
      resetActiveSuggestion()
    }
    onTextInput(e.currentTarget.value)

    setShowSuggestions(true)
  }

  function onClear() {
    onTextInput('')
  }

  function onFocus() {
    if (query.length && !suggestions.length) {
      onTextInput(query)
    }
  }

  function handleOnSuggestionSelection(
    suggestion: Suggestion,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault()
    e.stopPropagation()

    if (suggestion.index === MORE_RESULTS_INDEX) {
      resetActiveSuggestion()
      submit(suggestion.type)
    } else {
      onSuggestionSelection(suggestion)
      clearQuery()
    }

    setOpenSearchBarToggle(false)
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    submit()
  }

  function submit(type: string = '') {
    onBlur()

    if (query) {
      resetActiveSuggestion()
      onSubmit(type)
    }
  }

  function navigateSuggestions(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        e.preventDefault()
        if (!showSuggestions || !numberOfSuggestions) {
          return
        }

        onSuggestionActivate(
          getSuggestionByIndex(suggestions, Math.max(activeSuggestion.index - 1, -1)),
        )
        break
      // Arrow down
      case 40:
        if (!showSuggestions || !numberOfSuggestions) {
          return
        }
        onSuggestionActivate(
          getSuggestionByIndex(
            suggestions,
            Math.min(activeSuggestion.index + 1, numberOfSuggestions - 1),
          ),
        )
        break
      // Escape
      case 27:
        resetActiveSuggestion()
        setShowSuggestions(false)
        break
      // Enter
      case 13:
        if (activeSuggestion.index > -1) {
          onSuggestionSelection(activeSuggestion, e)
        }
        break
      default:
        break
    }
  }

  function clearQuery() {
    resetActiveSuggestion()
    setShowSuggestions(false)
    onTextInput()
  }

  function resetActiveSuggestion() {
    onSuggestionActivate()
  }

  const searchBarProps = {
    onBlur,
    onFocus,
    onChange: onInput,
    onClear,
    onKeyDown: navigateSuggestions,
    value: query || '',
  }

  const inputProps = {
    autoCapitalize: 'off',
    autoComplete: 'off',
    autoCorrect: 'off',
    id: 'auto-suggest__input',
    'data-test': 'search-input',
    placeholder: placeHolder,
    label: placeHolder,
  }

  const showAutoSuggest = suggestions.length > 0 && showSuggestions

  return (
    <form onSubmit={onFormSubmit} className="auto-suggest" data-test="search-form">
      <fieldset>
        {legendTitle && <legend className="u-sr-only">{legendTitle}</legend>}
        <Search
          {...{
            expanded: showAutoSuggest,
            suggestions,
            searchBarProps,
            openSearchBarToggle,
            inputProps,
            onBlur,
          }}
          onOpenSearchBarToggle={setOpenSearchBarToggle}
        >
          {showAutoSuggest && (
            <div className="auto-suggest__dropdown">
              <h3 className="auto-suggest__tip">Enkele suggesties</h3>
              {suggestions.map((category) => (
                <AutoSuggestCategory
                  activeSuggestion={activeSuggestion}
                  category={category}
                  key={category.label}
                  onSuggestionSelection={handleOnSuggestionSelection}
                  query={highlightQuery}
                />
              ))}
            </div>
          )}
        </Search>
      </fieldset>
    </form>
  )
}

export default AutoSuggest
