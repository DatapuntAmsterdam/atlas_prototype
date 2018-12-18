import React from 'react';
import PropTypes from 'prop-types';

import './_notification.scss';

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isNotificationVisible: true };

    this.hideNotification = this.hideNotification.bind(this);
  }

  hideNotification() {
    this.setState({ isNotificationVisible: false });
  }

  render() {
    return this.state.isNotificationVisible && (
      <p className={`
        ${this.props.className}
        notification
        notification--${this.props.level}
      `}
      >
        <span className="notification__content">{this.props.children}</span>
        { this.props.level !== 'message' && this.props.canClose &&
          <button
            className="notification__button"
            onClick={this.hideNotification}
          >
            <span className="notification__button--close" />
          </button>
        }
      </p>
    );
  }
}

Notification.defaultProps = {
  canClose: true,
  className: '',
  level: 'info'
};

Notification.propTypes = {
  canClose: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  className: PropTypes.string,
  level: PropTypes.oneOf(['alert', 'info', 'message'])
};

export default Notification;
