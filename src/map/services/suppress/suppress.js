let suppressing = false;

export const isBusy = () => suppressing;

export const start = (period = 100) => {
  suppressing = true;
  window.setTimeout(() => {
    suppressing = false;
  }, period);
};
