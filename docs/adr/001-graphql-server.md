# Create a GraphQL "normalization" server

Date: 18-11-2019

## Status

Accepted

## Context

This project is consuming APIs from different services, all these services have their own methods of returning data. To keep this application as "stupid" as possible, logic on how to bring data from different sources together is bundled in a GraphQL server, that's set up as a different project. The GraphQL server can be found [here](https://github.com/Amsterdam/cms_search) and is connected to different services like BAG and the Drupal CMS. Not only will this lead to a cleaner frontend application, it also cuts away the need of using Redux and/or Redux Saga's for new features in this project.


## Decision

New API services are connected throught the GraphQL server and Redux / Redux Saga is no longer used for new features


## Consequences

- When APIs are connected through the GraphQL server this might lead to slower response times
- By moving the normalization logic to a new project developers need knowledge of that project as well in case they want to change the structure of the API calls / responses
