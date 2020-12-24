import { Component } from 'react'
import PropTypes from 'prop-types'

class SelectButton extends Component {
  static getSelected(props) {
    return (
      props.options.find((option) => option.value === props.value) ||
      props.options[0] || {
        label: props.label,
        value: props.value,
      }
    )
  }

  constructor(props) {
    super(props)

    const selected = SelectButton.getSelected(props)

    this.state = {
      className: props.className,
      isDisabled: props.isDisabled,
      isExpanded: props.isExpanded,
      label: selected.label,
      value: selected.value,
    }

    this.handleToggle = this.handleToggle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickChild = this.handleClickChild.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = this.state
    let state = { isDisabled: nextProps.isDisabled }

    if (!value || nextProps.value) {
      const selected = SelectButton.getSelected(nextProps)

      state = {
        ...state,
        label: selected.label,
        value: selected.value,
      }
    }

    this.setState(state)
  }

  handleToggle() {
    const { isExpanded } = this.state
    // Attach/remove event handler
    if (!isExpanded) {
      document.addEventListener('click', this.handleOutsideClick, false)
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }

    this.toggleCollapse()
  }

  handleOutsideClick(event) {
    // Ignore clicks on the component itself
    if (this.node && this.node.contains(event.target)) {
      return
    }

    this.handleToggle()
  }

  handleClick(event) {
    const { handleChange } = this.props
    const { value } = this.state
    event.preventDefault()

    this.toggleCollapse(false)

    handleChange(value)
  }

  handleClickChild(event) {
    const { handleChange } = this.props
    event.preventDefault()

    this.setState({
      label: event.currentTarget.innerText,
      value: event.currentTarget.value,
    })

    handleChange(event.currentTarget.value)

    this.handleToggle()
  }

  // eslint-disable-next-line react/destructuring-assignment
  toggleCollapse(state = !this.state.isExpanded) {
    this.setState({
      isExpanded: state,
    })
  }

  render() {
    const { isExpanded, isDisabled, label, value, className } = this.state
    const { options, icon } = this.props
    return (
      <section
        className={`
          ${className}
          select-button
          select-button--${isExpanded ? 'expanded' : 'collapsed'}
          select-button--${isDisabled ? 'disabled' : 'enabled'}
        `}
        ref={(node) => {
          this.node = node
        }}
      >
        <button type="button" className="select-button__wrapper" onClick={this.handleClick}>
          {icon && <span className="select-button__custom-icon">{icon}</span>}
          <div className="select-button__label">{label}</div>
        </button>

        <button type="button" className="select-button__icon-wrapper" onClick={this.handleToggle}>
          <span
            className={`
            select-button__icon
            select-button__icon-${isExpanded ? 'collapse' : 'expand'}
          `}
          >
            <span className="u-sr-only">{isExpanded ? 'Inklappen' : 'Uitklappen'}</span>
          </span>
        </button>

        <ul className="select-button__drop-down">
          {options.map((option) => (
            <li
              className={`
                select-button__drop-down-item
                ${option.value === value && 'select-button__drop-down-item--selected'}
              `}
              key={option.value}
            >
              <button
                type="button"
                className="select-button__drop-down-button"
                onClick={this.handleClickChild}
                value={option.value}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }
}

/* istanbul ignore next */
SelectButton.defaultProps = {
  className: '',
  handleChange: () => {},
  icon: null,
  isDisabled: false,
  isExpanded: false,
  label: '',
  options: [],
  value: '',
}

SelectButton.propTypes = {
  className: PropTypes.string,
  handleChange: PropTypes.func,
  icon: PropTypes.shape({}),
  isDisabled: PropTypes.bool,
  isExpanded: PropTypes.bool,
  label: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  options: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
}

export default SelectButton
