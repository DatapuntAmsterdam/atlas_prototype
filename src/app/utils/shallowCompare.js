export default (a, b) =>
  Object.keys(a).every((key) => Object.keys(b).includes(key) && b[key] === a[key]);
