# Add storybook for development

Date: 05-09-2019

## Status

Accepted

## Context

While the `amsterdam-styled-components` project is growing and is getting used in several orther projects we have concluded that
the development of specific components for the `Dataportaal` should be better moved to the `atlas` project.
This will ensure that the `asc` contains only generic components and all the project specific components will be developed in the project itself.
Though we wanted to keep the advantages of developing components in storybook.

## Decision

We will add the storybook development tools to the `atlas` project

## Consequences

- There is a possibility that after the adding storybook, the builds will be a little bit slower due to extra packages added, but this is negligible.
- Due to the fact we are not importing all global styles in the storybook that are present in atlas, the rendered result of the components might slightly differ then in atlas.
