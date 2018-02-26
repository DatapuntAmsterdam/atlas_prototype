
import {
  disable,
  enable,
  isEnabled,
  setPolygon
} from './draw-tool';

import toggleDrawing from './draw-tool-toggle';

jest.mock('./draw-tool');

describe('The toggleDrawing functionality', () => {
  beforeEach(() => {
    enable.mockClear();
    disable.mockClear();
    setPolygon.mockClear();
  });

  it('should trigger toggle drawing on when clicked with zero markers', () => {
    isEnabled.mockImplementation(() => false);

    toggleDrawing(0);

    expect(enable).toHaveBeenCalled();
      // is should NOT reset polygon when there are no markers
    expect(setPolygon).not.toHaveBeenCalled();
  });

  it('should trigger toggle drawing off when clicked', () => {
    isEnabled.mockImplementation(() => true);

    toggleDrawing(0);
    expect(disable).toHaveBeenCalled();
  });

  it('should trigger toggle drawing on when clicked with 2 markers', () => {
    isEnabled.mockImplementation(() => false);

    toggleDrawing(2);
    expect(enable).toHaveBeenCalled();
      // is should reset polygon when there are no markers
    expect(setPolygon).toHaveBeenCalledWith([]);
  });
});

