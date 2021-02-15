# Keycloak implementation

Date: 10-02-2021

## Status

Proposed

## Context

The `atlas` application offers visitors a way to authenticate their session so that specific, privacy sensitive, data can be viewed that would otherwise be inaccessible. The authentication mechanism is provided by a service (Amsterdam Authz) that was developed in-house several years ago. It queries an internal database (IdP) as well as the active directory of registered users at the municipality of Amsterdam. The latter uses [Grip](https://www.grip-on-it.com/) which isn't officially supported anymore (or wasn't ever) and will be discontinued in the near future. As a replacement authorization service, Keycloak has been chosen. It has, at the time of writing, been implemented by [blackspots-frontend](https://github.com/Amsterdam/blackspots-frontend), [zaken-frontend](https://github.com/Amsterdam/zaken-frontend), [fixxx-looplijsten-frontend](https://github.com/Amsterdam/fixxx-looplijsten-frontend) and [signals-frontend](https://github.com/Amsterdam/signals-frontend).

The Keycloak authorization service has [a JS package](https://github.com/keycloak/keycloak) and [a React package](https://github.com/react-keycloak/react-keycloak) that can be used to replace the Amsterdam Authz service with. Note that none of the mentioned Amsterdam projects use the React package.

To test it, a Keycloak server can be set up locally with Docker. See the [`docker-compose`](../../docker-compose.yml).

[The Keycloak documentation](https://www.keycloak.org/docs/latest/authorization_services/index.html#_authorization_quickstarts) describes the process of creating a realm and a user for that realm. Without it, the service cannot be tested.

By default, access tokens are valid for a maximum of five minutes. The Keycloak service instance should be configured to refresh the token before it expires to prevent users from logging out during their active session.

## Decision

The [react-keycloak package](https://github.com/react-keycloak/react-keycloak) can be used to replace the current implementation. The available `useKeyclock` hook can be used to verify if a user is authenticated and the `init` function can be passed props to refresh the access token at a set interval so that sessions do not expire.

## Consequences

All of the entries in the IdP need to be transferred to the Keycloak service before Keycloak can fully replace the existing Authz service.
