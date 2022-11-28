---
sidebar_position: 2
title: Multiplexing packets
---

# Multiplexing packets
You may want to connect your gateway to multiple LoRa networks at the same time. By using a *multiplexer* you 
can forwarder packets from your LoRa radio to multiple networks at the same time. Here we describe two setups:

- Running [gwmp-mux](https://github.com/ThingsIXFoundation/gwmp-mux) on the gateway itself
- Running [chirpstack-packet-multiplexer](https://github.com/brocaar/chirpstack-packet-multiplexer) on a server for multiple gateways.

:::tip Help needed?
Head over to the [ThingsIX Discord](https://discord.gg/y93x9M7UCq) to get community support.
:::

## gwmp-mux
[gwmp-mux](https://github.com/ThingsIXFoundation/gwmp-mux) is a simple application that forwards Semtech UDP packets to multiple endpoints on the same gateway.

This example receives traffic on UDP port 1680 and forwards it to `127.0.0.1:1681` and `127.0.0.1:1682`:

```bash
docker run -d --restart unless-stopped --network host --name gwmp-mux ghcr.io/thingsixfoundation/gwmp-mux:latest --host 1680 --client 127.0.0.1:1681 --client 127.0.0.1:1682
```
Note: We run the docker container in host network mode here. This allows it to connect to other services on `127.0.0.1` However this also exposes the UDP port 1680 on all the IP-addresses of the host (including public ones). Use a firewall to close-down any unwanted access.

You can also run the gwmp-mux in overlay mode (default), however in that case you cannot use `127.0.0.1` as destination for forwarding as it refers to the local docker container networking stack, and not the host networking stack. You can use gwmp-mux in a docker-compose setup with an shared network as a work-around. 

## chirpstack-packet-multiplexer
For now follow the instructions on the [chirpstack-packet-multiplexer](https://github.com/brocaar/chirpstack-packet-multiplexer)
