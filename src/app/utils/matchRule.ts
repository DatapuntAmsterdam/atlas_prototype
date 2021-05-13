// https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
export default function matchRule(str: string, rule: string) {
  return new RegExp(
    `^${rule
      .split('*')
      .map((part) => part.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'))
      .join('.*')}$`,
  ).test(str)
}
