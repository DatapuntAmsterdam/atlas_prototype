# Feature toggles

Date: 23-02-2021

## Status

Accepted

## Context

Some functionalities are not ready for production straight away and need to be tested in isolation until they are deemed ready for production use. We want to have some way of enabling a feature so that it can be tested by developers, testers or small user groups.

## Decision

A mechanism is introduced to allow toggling of features by setting a feature flag in the local storage of the browser. This means that the feature will only be visible when it is explicitly enabled by the user.

## Consequences

Feature toggles will have to be removed after they are deemed production ready.
