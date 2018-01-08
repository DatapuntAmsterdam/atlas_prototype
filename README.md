# City Data

## Requirements
- npm
- Webpack
- Java JRE (needed to run protractor)

## Installations
- npm install

## Development
- NODE_ENV=development npm start
- Open the server at http://localhost:8080/

## Testing
- NODE_ENV=development npm test

## Other useful commands

- `grunt build-release`
- `npm run clean`
- `npm run test-lint`

## E2E testing
Make sure the app is running locally by running `grunt`.
Then, in a second terminal, run `grunt test-e2e`.

## Aria testing
Make sure that NODE_ENV=development.
Then run `npm run test-aria`.

In order to run the E2E tests, the following environment variables should be set:
- `PASSWORD_EMPLOYEE`
- `PASSWORD_EMPLOYEE_PLUS`
- `USERNAME_EMPLOYEE`
- `USERNAME_EMPLOYEE_PLUS`
They can simply be added by using the `export` command from the command line, or by providing the variables as a
prefix to the desired command, e.g. `PASSWORD_EMPLOYEE=password grunt test-e2e`.

## Techniques used
- AngularJS
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
