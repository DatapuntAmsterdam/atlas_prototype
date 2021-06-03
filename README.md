# Data verkenner

The open-source codebase for the [Data explorer](https://data.amsterdam.nl/) of the City of Amsterdam; the central hub for objective, reliable and actual data, and information about Amsterdam. This explorer contains interactive data visualizations in an interactive map and tables.

## Installation

Install all dependencies:

```bash
npm install
```

## Development

Start the application:

```bash
npm start
```

Then, open the application in your browser at [localhost:3000](http://localhost:3000/).

### Docker

The `docker-compose.yml` file contains environment variable declarations that are required for the application to run in production mode. The production environment can be set up locally by running

```bash
make start
```

The `Makefile` consists of other useful commands to stop, restart and rebuild the application. To see all commands, run

```bash
make help
```

## Testing

```bash
npm run test
```

### E2E testing

In order to E2E test the application make sure you have a development server running locally:

```bash
npm run start
```

After doing this open up a new terminal and run the following commands:

```bash
npm run test:e2e
```

This will start the E2E test, if you want to watch for changes you can also run `npm run test:e2e:watch` instead.

### Analyzing a production bundle

```bash
npm run analyze
```

### Linting the code

```bash
npm run lint
```

### Deploying to a demo server

There are three demo servers that can be deployed to, to deploy to one of these servers run the following command on your branch.

```bash
npm run deploy:demo
```
