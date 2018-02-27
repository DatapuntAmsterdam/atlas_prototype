# City Data

## Requirements
- npm
- Java JRE (needed to run protractor)

## Installations
- npm install

## Development
- NODE_ENV=development npm start
- Open the server at http://localhost:8080/

## Testing

Karma & Jest unit test

```
NODE_ENV=development npm test
```

### E2E testing authentication

In order to test authentication the following environment variables must be set:

- `PASSWORD_EMPLOYEE`
- `PASSWORD_EMPLOYEE_PLUS`
- `USERNAME_EMPLOYEE`
- `USERNAME_EMPLOYEE_PLUS`

They can simply be added by using the `export` command from the command line, or by adding these
variables to `.bash_profile`.

### E2E Functional testing

Make sure the app is running locally by running `npm start`.
Then, in a second terminal, run `npm run test-e2e` (single run) or `npm run test-e2e-watch` (#GUI, watch).

### E2E Aria testing

Make sure that `NODE_ENV=development`.
Then run `npm run test-aria`.

### E2E Visual testing

_Currently not working in CI_

`npm run test-visual-regression`

and

`docker-compose up --build test-e2e-visual`


## Other useful commands

- `npm run clean`
- `npm run test-lint`

## Techniques used
- AngularJS
- React
- Redux
- Leaflet
- D3

## Conventions used
- John Papa Angular style guide (https://github.com/johnpapa/angular-styleguide/tree/master/a1)
- EditorConfig (http://editorconfig.org/)
- BEM (http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- BEMIT (http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- BEM namespaces (http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)
- [GitFlow](https://datasift.github.io/gitflow/IntroducingGitFlow.html) without tags and a release branch
