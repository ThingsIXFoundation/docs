---
sidebar_position: 1
---

# Introduction
ThingsIX uses a plugin-based system. Data is stored in a registry and
modifications are made by sending transactions to a plugin that will validate
the request and make the changes in the registry. Retrieving information is done
typically from the registry while modifications are made through plugins. This
system allows us to deploy additional plugins to add functionality while not
introducing proxy magic.

:::caution
Developers need to be aware that ThingsIX can choose to deactivate a 
plugin in case of a problem and replace it with a new version that can offer a
different interface.
:::
