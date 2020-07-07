import * as Sentry from '@sentry/browser'

const environment = process.env.NODE_ENV
const release = process.env.GIT_COMMIT

if (environment !== 'development') {
  Sentry.init({
    dsn: 'https://43045d79c42e4eb7a9bdf8e22fff0d9b@sentry.data.amsterdam.nl/29',
    environment,
    release,
  })
}
