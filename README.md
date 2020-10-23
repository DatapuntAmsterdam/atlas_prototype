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
npm test
```

Only Karma unit tests

```
npm run test:karma
```

Only Jest unit tests

```
npm run test:jest
```

### E2E testing

In order to E2E test the application make sure you have a development server running locally:

```bash
npm run start
```

> Note: Due to a missing polyfill for the Fetch API you will have to run your build with `legacy` set to `true` in the build config.

After doing this open up a new terminal and run the following commands:

```
cd test/e2e
npm run start
```

This will start the E2E test, if you want to watch for changes you can also run `npm run watch` instead.

### Analyzing a production bundle

```bash
# Analyze the modern browser bundle (ES2015+)
npm run analyze:modern
# Analyze the legacy browser bundle (ES5)
npm run analyze:legacy
```

### Deploying to a demo server

There are three demo servers that can be deployed to, to deploy to one of these servers run the following command on your branch.

```bash
npm run deploy:demo
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
  work-around: install sass-lint globally and run commands specified in the `lint:style` script direct in a bash
  terminal

## Thanks to

<img src="/public/images/browserstack-logo@2x.png" height="60" title="BrowserStack Logo" alt="BrowserStack Logo" />
