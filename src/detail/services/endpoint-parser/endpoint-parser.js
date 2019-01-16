const isZakelijkRecht = (someUriParts) => someUriParts[0] === 'brk' &&
  someUriParts[1] === 'zakelijk-recht' &&
  someUriParts[someUriParts.length - 1] === 'subject';

export const getParts = (endpoint) => {
  const anchor = document.createElement('a');
  anchor.href = endpoint;

  // Transform http://www.api-root.com/this/that/123 to ['this', 'that', '123']
  const uriParts = anchor.pathname
    .replace(/^\//, '') // Strip leading slash
    .replace(/\/$/, '') // Strip trailing slash
    .split('/');

  if (isZakelijkRecht(uriParts)) {
    return ['brk', 'subject'];
  }
  // Remove the last segment (the ID)
  uriParts.pop();

  // Return the last two 'path' segments
  return uriParts.slice(-2);
};

export const getTemplateUrl = (endpoint) => {
  const [category, subject] = getParts(endpoint);
  return `modules/detail/components/detail/templates/${category}/${subject}.html`;
};

export const toGlossaryKey = (type, subject) => {
  let key = subject;
  if (type === 'grondexploitatie') {
    // grondexploitatie subject === "project", 'grondexploitatie' is more descriptive value.
    key = type;
  }
  return key.toUpperCase().replace(/-/g, '_');
};

export const getGlossaryKey = (endpoint) => {
  const [type, subject] = getParts(endpoint);
  return toGlossaryKey(type, subject);
};

const endpointParser = {
  getTemplateUrl,
  getGlossaryKey,
  getParts
};

export default endpointParser;
