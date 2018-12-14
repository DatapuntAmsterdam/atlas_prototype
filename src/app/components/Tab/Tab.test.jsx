import React from 'react';
import { shallow } from 'enzyme';
import Tab from './Tab';

describe('Tab', () => {
  let onClick;

  beforeEach(() => {
    onClick = jest.fn();
  });

  describe('the current tab', () => {
    it('should render', () => {
      const tab = shallow(
        <Tab
          isCurrentTab
          label="myTab"
          onClick={onClick}
        />
      );
      expect(tab).toMatchSnapshot();
    });

    it('should set the count', () => {
      const tab = shallow(
        <Tab
          isCurrentTab
          count={42}
          label="myTab"
          onClick={onClick}
        />
      );
      expect(tab.text()).toContain(42);
    });
  });
  describe('not the current tab', () => {
    it('should render', () => {
      const tab = shallow(
        <Tab
          label="myTab"
          onClick={onClick}
        />
      );
      expect(tab).toMatchSnapshot();
    });

    it('should handle clicks', () => {
      const tab = shallow(
        <Tab
          label="myTab"
          onClick={onClick}
        />
      );
      tab.find('button').simulate('click');
      expect(onClick.mock.calls.length).toBe(1);
    });

    it('should use the count', () => {
      const tab = shallow(
        <Tab
          label="myTab"
          count={42}
          onClick={onClick}
        />
      );
      expect(tab.text()).toContain(42);
    });
  });
});
