export const path = '/';
export function render(req, res) {
  let html = '<h1>dyson</h1><p>Example endpoints:</p>';
  const examples = [
    '/user',
    '/users',
    '/employee/5',
    '/feature/bar',
    '/feature/999',
    '/features/50',
    '/features/50/?foo=bar&x=y',
    '/image/400x200',
    '/image/300x500/000/fff',
    '/image/600x150/000/fff.gif&text=dummyimage.com+rocks!',
    '/images'
  ];
  html += `<ul>${examples.map((example) => `<li><a href="${example}">${example}</a></li>`).join('')}</ul>`;
  res.send(200, html);
}
