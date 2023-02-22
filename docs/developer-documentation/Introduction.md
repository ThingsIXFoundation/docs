---
sidebar_position: 1
---
# Introduction
The core of ThingsIX is a set of smart contracts to register and manage gateways,
mappers, routers and claim earned rewards. In addition, we offer the 
[data-aggregator](https://github.com/ThingsIXFoundation/data-aggregator) service
that aggregates data from these smart contracts into a Google datastore and 
provide an HTTP API to access it.

ThingsIX offers a dashboard that provides an easy method to interact with these
smart contracts and data-aggregator service API. For users that want to
integrate ThingsIX into their service, or build a new service on top of ThingsIX
we offer the required information to interact direct with the smart contracts 
and API.

## Coverage mapping data
The exception is coverage mapping data. ThingsIX uses the Polygon blockchain 
that isn't suitable to process large amounts of mapping data. We will offer
a public data feed that provides this data for anyone to capture it.