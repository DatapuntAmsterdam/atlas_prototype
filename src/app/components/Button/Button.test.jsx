import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

describe('Button', () => {
  let component;
  const clickMock = jest.fn();
  beforeEach(() => {
    component = shallow(
      <Button
        title="This is a button"
        onClick={clickMock}
        alignLeft
      >
        Hello, I am a button
      </Button>
    );
  });

  it('should render', () => {
    expect(component).toMatchSnapshot();
  });

  it('should call the onClick prop when button is clicked', () => {
    component.find('button').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
