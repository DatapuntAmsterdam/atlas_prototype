import React from 'react';
import PropTypes from 'prop-types';

import './_checkbox.scss';

class Checkbox extends React.Component {
  static evaluateChecked(checked) {
    if (typeof checked === 'function') {
      return !!checked();
    }
    return !!checked;
  }

  constructor(props) {
    super(props);

    this.state = {
      checked: Checkbox.evaluateChecked(this.props.checked)
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: Checkbox.evaluateChecked(nextProps.checked)
    });
  }

  handleChange(event) {
    this.setState({
      checked: !this.state.checked
    });
    this.props.onChange(event);
  }

  render() {
    return (
      <span className="checkbox">
        <input
          checked={this.state.checked}
          name={this.props.name}
          aria-label={this.props.name}
          onChange={this.handleChange}
          type="checkbox"
        />
      </span>
    );
  }
}

/* istanbul ignore next */
Checkbox.defaultProps = {
  checked: false,
  onChange: () => {}
};

Checkbox.propTypes = {
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default Checkbox;
