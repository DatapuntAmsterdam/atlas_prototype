# Data en informatie

The open-source codebase for the ["Data en Informatie" portal](https://data.amsterdam.nl/) of the City of Amsterdam; the central hub for objective, reliable and actual data, and information about Amsterdam. This portal contains three sections: redactional content including articles, animations, dashboards, and interactive data visualizations; an application part that visualizes data in an interactive map and tables; and a data catalog providing files and APIs for public and private use.

## Requirements

- [npm](https://www.npmjs.com/)

## Installation

Install all dependencies:

```
npm install
```

## Development

Start the application:

```
npm start
```

Then, open the application in your browser at [localhost:3000](http://localhost:3000/).

## Testing

Karma & Jest unit and (Jest) integration test

```
NODE_ENV=development npm test
```

Only Karma unit tests

```
NODE_ENV=development npm run test:karma
```

Only Jest unit tests

```
NODE_ENV=development npm run test:jest
```

### E2E testing

End to end test can either run against a local server or through docker-compose.

In order to test authentication the following environment variables must be set:

- `PASSWORD_EMPLOYEE`
- `PASSWORD_EMPLOYEE_PLUS`
- `USERNAME_EMPLOYEE`
- `USERNAME_EMPLOYEE_PLUS`

They can simply be added by using the `export` command from the command line, or by adding these
variables to `.bash_profile`.

Make sure the app is running locally by running `npm start`.
Then, in a second terminal, go to `cd test/e2e` and run `npm run start` (single run).
Or open the UI using `npm run watch`.

Test using docker-compose:
```
docker-compose up --build test-e2e
```

To test against production APIs you can use the same tasks, suffixed with `prod`:

- Make sure the app is running locally by running `npm run start:prod`.
- Then, in a second terminal, run `npm run test-e2e-prod` (single run).
- Or open the UI using `npm run test-e2e-prod-watch`.

### E2E Aria testing

Make sure the app is running locally.
Then run `npm run test-aria`.

Test using docker-compose:

```
docker-compose up --build test-e2e-aria
```

### Analyzing a production bundle

```bash
npm run analyze
```

## Other useful commands

- `npm run clean`
- `npm run lint`

## Related projects

- API health checks used in this project buid pipeline: https://github.com/Amsterdam/atlas-health-checks

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

## Known issues
- on windows there is a bug in sass-lint that prevents `npm run lint` to fail when there are linting errors.
  work-around: install sass-lint globally and run commands specified in the  `lint:style` script direct in a bash
  terminal

## Thanks to
<img src="/public/images/browserstack-logo@2x.png" height="60" title="BrowserStack Logo" alt="BrowserStack Logo" />
