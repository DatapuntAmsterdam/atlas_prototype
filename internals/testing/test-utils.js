export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload
  };
  expect(action(payload)).toEqual(expected);
};

