---
sidebar_position: 1
title: Gateway Compatibility Overview
---

# Gateway Compatibility Overview

## Introduction

Almost all LoRaWAN gateways are compatible with ThingsIX: The only requirement is that the gateway is a regular 8-channel LoRaWAN gateway that supports the Semtech UDP or BasicStation protocol. No hardware approval by the ThingsIX Foundation is required. You can use any DIY or existing LoRaWAN gateway that meets the above requirements.

Gateways should have the right frequency-plan that ThingsIX supports in the are where you plan to operate the Gateway. 

:::caution Disclaimer
The table below gives an overview of gateways that members of the ThingsIX Community have found to be compatible with ThingsIX. The ThingsIX Foundation has not reviewed the gateways listed below or the companies offering them for sale and as such can give no guarantees about the correctness of the information listed below or the reliability of the companies manufacturing them. 

Do your own research before deciding to buy a gateway.
:::

This table identifies different levels of support:
- ✅ Dashboard: A dashboard is provided where the gateway can be connected and onboarded to ThingsIX without the need for setting up a ThingsIX Forwarder yourself. This is the easiest option. 
- ✅🔄 Custom Firmware with Dashboard: By installing a custom firmware a Dashboard can be setup up. This requires some technical knowledge. 
- 🔄 Custom Firmware: The firmware of the gateway can be replaced with one that supports running a ThingsIX Forwarder. This requires technical knowledge. 
- ➡️ Forwarder: The firmware of the gateway supports the Semtech UDP protocol or BasicStation protocol to connect it to an externally running ThingsIX Forwarder (see: [Setting up VPS](../setting-up-vps.md) and [Installing Forwarder](../installing-forwarder.md))/
- ❌ No support: The gateway does not support connecting to ThingsIX in any way. 

| Manufacturer  | Name/Model                      | Support                    | Link to instructions | Remarks                              |
|---------------|---------------------------------|----------------------------|----------------------|--------------------------------------|
| LongAP        | LongAP Pro                      | ✅ Dashboard                  |                      | e-mail support@longap.com to onboard |
| LongAP        | LongAP One                      | ✅ Dashboard                  |                      | e-mail support@longap.com to onboard |
| Nebra         | Nebra HNT Indoor Hotspot Miner  | ✅ Dashboard, 🔄 Custom Firmware |                      | requires paid subscription           |
| Nebra         | Nebra HNT Outdoor Hotspot Miner | ✅ Dashboard, 🔄 Custom Firmware |                      | requires paid subscription           |