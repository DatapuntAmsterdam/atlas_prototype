export const path = '/';
export function render(req, res) {
  let html = '<h1>dyson</h1><p>Example endpoints:</p>';
  const examples = [
    '/user',
    '/users'
  ];
  html += `<ul>${examples.map((example) => `<li><a href="${example}">${example}</a></li>`).join('')}</ul>`;
  res.send(200, html);
}
