# Proxy for requests in tests

Date: 21-01-2021

## Status

Accepted

## Context

The `atlas` application depends on the output of a plethora of APIs (see [the api fixtures folder](../../src/api)). Components that consume the output, usually transform or normalize that output before rendering. To prevent network requests to be made, some of the unit tests in the project already make use of custom, rudimentary data fixtures to provide components with the necessary data. Integration tests, however, still rely on network requests for the completion of those tests.

Neither type of test makes use of a standardized collection of data fixtures. This increases maintenance, limits the (automated) execution of tests and can lead to false positives, because of tailored data instead of 'true' data.

## Decision

To ensure that both integration and unit tests can be run without having to rely on a network connection present, data fixtures should be used for all requests that query an API endpoint and expect a specific data structure to be provided. Those data fixtures should be stored in the application's code base and should be accessible to both types of tests.

To prevent having to set and endpoint's output per test suite or test case, a request proxy should be configured that catches all requests and returns a data fixture for those requests. This way, all requests are configured in a central location and the same data is returned for a specific request. This proxy should serve both integration and unit tests.

The data fixtures must resemble the exact output of the API endpoints that are used in the application.

## Consequences

Benefits:
- reduce boilerplate in both integration and unit tests
- ensure that a request to endpoint X will always return the data of fixture Y
- storing data fixtures locally allows for typed data which will limit the number of errors in components that consume the data

Downsides:
- API output has to be captured and stored, which can be a lot of work
