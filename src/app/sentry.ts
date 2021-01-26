import { init } from '@sentry/browser'
import environment from '../environment'

const deployEnv = environment.DEPLOY_ENV

// Only initialize Sentry on production builds.
if (process.env.NODE_ENV === 'production') {
  init({
    dsn: 'https://43045d79c42e4eb7a9bdf8e22fff0d9b@sentry.data.amsterdam.nl/29',
    environment: deployEnv,
  })
}
