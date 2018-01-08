import React from 'react';
import { shallow } from 'enzyme';

import Notification from '../Notification';

describe('Notification', () => {
  it('should render the provided message', () => {
    const notification = shallow(
      <Notification>
        Test message
      </Notification>
    );

    expect(notification.find('.notification__content').text()).toBe('Test message');
    expect(notification).toMatchSnapshot();
  });

  it('should add the notification level as class name', () => {
    const notification = shallow(
      <Notification level="error">
        Test message
      </Notification>
    );

    expect(notification.find('.notification--error').length).toBe(1);
    expect(notification).toMatchSnapshot();
  });

  it('should be able to render `a` elements', () => {
    const notification = shallow(
      <Notification>
        <a href="http://real-address.com">External link</a>
      </Notification>
    );

    expect(notification.find('a').length).toBe(1);
    expect(notification).toMatchSnapshot();
  });

  it('should hide notification on click', () => {
    const notification = shallow(
      <Notification>
        Test message
      </Notification>
    );

    notification.find('.notification__button').simulate('click');
    expect(notification.isEmptyRender()).toBe(true);
  });
});
