//
// Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
// When packager is available (WebPack), consider switching to https://github.com/buunguyen/redux-freeze
// TODO: tg 4069
//
const deepFreeze = (obj) => {
  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach((name) => {
    const prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
};

export default deepFreeze;
