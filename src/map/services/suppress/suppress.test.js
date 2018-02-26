import { start, isBusy } from './suppress';

jest.useFakeTimers();

describe('Suppress', () => {
  it('default timeout', () => {
    start();

    jest.advanceTimersByTime(99);
    expect(isBusy()).toBeTruthy();

    jest.advanceTimersByTime(1);
    expect(isBusy()).toBeFalsy();
  });

  it('custom timeout', () => {
    start(666);

    jest.advanceTimersByTime(665);
    expect(isBusy()).toBeTruthy();

    jest.advanceTimersByTime(1);
    expect(isBusy()).toBeFalsy();
  });
});
