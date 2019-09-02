# Use Yarn instead of NPM

Data: 02-09-2019

## Status

Accepted

## Context

When we introduced a post-merge hook to run `npm i` when the package.json has changed, we noticed 
that this would take ~18 seconds to run, even if there aren't any dependencies updated. Yarn 
verifies the versions in the package.json with the versions in the yarn.lock file. This takes about
a second to run. Also installing dependencies in general usually faster than npm. It results in 
giving our development speed a little boost. Furthermore, almost all front-end projects within 
Amsterdam - Datapunt are using yarn. To preserve unity of using the same tools as much as possible, 
we chose to switch to Yarn.
