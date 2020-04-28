import React from 'react'
import PropTypes from 'prop-types'
import AutoSuggestCategory, { MORE_RESULTS_INDEX } from './AutoSuggestCategory'
import './_auto-suggest.scss'
import Search from './Search'

const getSuggestionByIndex = (searchResults, suggestionIndex) =>
  searchResults
    .reduce((flatResults, category) => [...flatResults, ...category.content], [])
    .find((flatSuggestion) => flatSuggestion.index === suggestionIndex)

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props)
    this.clearQuery = this.clearQuery.bind(this)
    this.navigateSuggestions = this.navigateSuggestions.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onSuggestionSelection = this.onSuggestionSelection.bind(this)
    this.onOpenSearchBarToggle = this.onOpenSearchBarToggle.bind(this)
    this.state = {
      openSearchBarToggle: false,
      showSuggestions: false,
    }
  }

  onBlur() {
    setTimeout(() => {
      this.setState({
        showSuggestions: false,
        openSearchBarToggle: false,
      })
    }, 200)
  }

  onInput(e) {
    const { onTextInput, activeSuggestion } = this.props

    if (activeSuggestion.index > -1) {
      this.resetActiveSuggestion()
    }
    onTextInput(e.currentTarget.value)

    this.setState({
      showSuggestions: true,
    })
  }

  onClear() {
    const { onTextInput } = this.props
    onTextInput('')
  }

  onFocus() {
    const { onTextInput, suggestions, query } = this.props

    if (query.length && !suggestions.length) {
      onTextInput(query)
    }
  }

  onSuggestionSelection(suggestion, event) {
    const { onSuggestionSelection } = this.props
    event.preventDefault()
    event.stopPropagation()

    if (suggestion.index === MORE_RESULTS_INDEX) {
      this.resetActiveSuggestion()
      this.onFormSubmit(event, suggestion?.type)
    } else {
      onSuggestionSelection(suggestion)
      this.clearQuery()
    }

    this.setState({
      openSearchBarToggle: false,
    })
  }

  onFormSubmit(event, type = null) {
    const { onSubmit, query } = this.props

    event.preventDefault()
    event.stopPropagation()

    this.setState(
      {
        showSuggestions: false,
        openSearchBarToggle: false,
      },
      () => {
        if (query) {
          this.resetActiveSuggestion()
          onSubmit(type)
        }
      },
    )
  }

  onOpenSearchBarToggle(open) {
    this.setState({
      openSearchBarToggle: open,
    })
  }

  navigateSuggestions(event) {
    const { activeSuggestion, numberOfSuggestions, onSuggestionActivate, suggestions } = this.props

    const { showSuggestions } = this.state

    switch (event.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        event.preventDefault()
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
        this.resetActiveSuggestion()
        this.setState({
          showSuggestions: false,
        })
        break
      // Enter
      case 13:
        if (activeSuggestion.index > -1) {
          this.onSuggestionSelection(activeSuggestion, event)
        }
        break
      default:
        break
    }
  }

  clearQuery() {
    const { onTextInput } = this.props

    this.resetActiveSuggestion()
    this.setState({
      showSuggestions: false,
    })
    onTextInput()
  }

  resetActiveSuggestion() {
    const { onSuggestionActivate } = this.props

    onSuggestionActivate()
  }

  render() {
    const {
      activeSuggestion,
      highlightQuery,
      legendTitle,
      placeHolder,
      query,
      suggestions,
    } = this.props

    const { showSuggestions, openSearchBarToggle } = this.state

    const searchBarProps = {
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onChange: this.onInput,
      onClear: this.onClear,
      onKeyDown: this.navigateSuggestions,
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
      <form onSubmit={this.onFormSubmit} className="auto-suggest" data-test="search-form">
        <fieldset>
          {legendTitle && <legend className="u-sr-only">{legendTitle}</legend>}
          <Search
            {...{
              expanded: showAutoSuggest,
              suggestions,
              searchBarProps,
              openSearchBarToggle,
              inputProps,
              onBlur: this.onBlur,
            }}
            onOpenSearchBarToggle={this.onOpenSearchBarToggle}
            onSuggestionSelection={this.onSuggestionSelection}
          >
            {showAutoSuggest && (
              <div className="auto-suggest__dropdown">
                <h3 className="auto-suggest__tip">Enkele suggesties</h3>
                {suggestions.map((category) => (
                  <AutoSuggestCategory
                    activeSuggestion={activeSuggestion}
                    category={category}
                    key={category.label}
                    onSuggestionSelection={this.onSuggestionSelection}
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
}

AutoSuggest.propTypes = {
  activeSuggestion: PropTypes.shape({
    category: PropTypes.string,
    index: PropTypes.number,
    label: PropTypes.string,
    uri: PropTypes.string,
  }).isRequired,
  highlightQuery: PropTypes.string,
  legendTitle: PropTypes.string,
  numberOfSuggestions: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onSuggestionActivate: PropTypes.func.isRequired,
  onSuggestionSelection: PropTypes.func.isRequired,
  onTextInput: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  query: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
}

AutoSuggest.defaultProps = {
  highlightQuery: '',
  legendTitle: '',
  numberOfSuggestions: 0,
  placeHolder: '',
  query: '',
  suggestions: [],
}

export default AutoSuggest
