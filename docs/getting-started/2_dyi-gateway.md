---
sidebar_position: 2
title: For gateway owner
---

## Introduction
This page explains which software components are required for your gateways to
join the ThingsIX network, either in a single network or in a multi network
setup. ThingsIX provides the [ThingsIX forwarder](#thingsix-forwarder) that is 
the portal for your gateways to the ThingsIX network. If your gateways uses 
Semtech's UDP protocol and it allows you to provide an endpoint where it will 
send data to you can install the forwarder and configure your gateway to send 
its data to. This is the easiest way for your gateway to join the ThingsIX 
network. If you want to follow this approach go to the ThingsIX forwarder 
[section](#thingsix-forwarder) and follow the instructions how to install and 
configure the forwarder and configure your gateway to use the forwarders 
endpoint and you are good to go.

If your gateway needs to join multiple networks there are 2 methods to 
accomplish that. You need to determine the method that suits your situation 
the best. Both methods are described here and use components from the
[Chirpstack project](https://www.chirpstack.io).

1. run a concentratord service (service that connects with the
LoRa® radio chip) on the gateway that supports multiplexing. See 
[this](#multiplexer-on-gateway) section for instructions.
2. run a multiplexer on a server and connect your gateways to
that multiplexer. The multiplexer will exchange data with all configured
networks, completely transparent from the gateways point of view. See 
[this](#multiplexer-on-server) section for instructions.

## Multiplexing on the gateway {#multiplexer-on-gateway}
In this setup the gateway runs software that allows it to exchange data with
multiple networks. Most gateways don't support this out of the box and requires 
the user to install custom software. This is the biggest drawback of this method 
since it makes the user responsible for building, installing, configuration and 
updates which is not a trivial task. Especially building software requires often 
cross-compiling and custom patches on existing software to make it work.

Since there are many different gateways with various types of 
operating systems this guide expects you to know how to compile, install, 
configure and run software on your gateway. These kind of details are out 
of scope in this guide. We have a Discord [channel](https://discord.com/channels/1008035508221378631/1009186341411635270)
aimed at DIY gateways that you can ask for help.


This guide uses the [Chirpstack concentratord](https://www.chirpstack.io/docs/chirpstack-concentratord/index.html).
This concentratord supports multiplexing by opening a ZMQ socket on which 1 or 
more so called bridges can connect. Each bridge will forward the data for one 
or more networks. This approach therefore allows the gateway to join multiple 
networks at once. It also supports networks with particular requirements such 
as networks that require special software to run on the gateway.  

### Install Chirpstack concentratord
See [this page](https://www.chirpstack.io/docs/chirpstack-concentratord/hardware-support.html)
for a list of supported chips and gateways. If your gateway is not listed check 
with your gateways documentation what LoRa® chip your gateway uses. Determine which
version of concentratord is suitable for your gateway. Unfortunately at the
time of writing Chirpstack doesn't provide binaries but are planning to offer
them soon. Check the [download](https://www.chirpstack.io/docs/chirpstack-concentratord/downloads.html)
page if binaries are available for your gateway. If not, you need to compile the
concentratord from [source](https://github.com/chirpstack/chirpstack-concentratord)
for your gateway. Copy the concentratord to the gateway.

### Run concentratord
The next step is to create a configuration for the concentratord service. The
Chirpstack documentation has a dedicated section how to create a configuration 
that can be found [here](https://www.chirpstack.io/docs/chirpstack-concentratord/configuration.html).
Pay good attention to the `gateway` section of the configuration and use the
documentation provided by the gateway manufacturer to set the correct values.

Install the concentratord binary and configuration on the gateway. Stop existing
processes that use the LoRa® radio chip and start the concentratord. If
everything works correct it will open 2 ZMQ sockets, 1 for bridges to exchange
data and a command socket over which commands can be send to the concentratord.
The location of these sockets are set in the concentratord configuration.

If the concentratord starts successfully it will log something like:
```
Gateway ID retrieved, gateway_id: "0016c001f1500812"
```
Write down the `gateway_id` since you will need it later.

### Install bridge
The next step is to install a bridge that exchange data with networks. This
bridge serves 2 purposes, convert data from the internal Chirpstack format that
the contentratord uses to the format the network uses. And exchange data
between the contractord and the network(s). The Chirpstack project offers a
bridge that converts between the concentratord internal format and Semtech's UDP
protocol that the ThingsIX forwarder uses. It can be found 
[here](https://github.com/chirpstack/chirpstack-udp-forwarder), including a 
configuration example.

Ensure that the concentratord `event_url` and `command_url` match the
`event_bind` and `command_bind` configuration in the concentratord's
configuration and repeat the `[[udp_forwarder.servers]]` section for each
network that the bridge need to exchange data with.

The [ThingsIX forwarder](#thingsix-forwarder) supports the Semtech's UDP
protocol and once its up and running you will need to add one 
`[[udp_forwarder.servers]]` section here and add the ThingsIX forwarders
endpoint here.

## Multiplexing on a server {#multiplexer-on-server}
With this method a multiplexer service is installed on a server. Gateways
connect to this multiplexer and the multiplexer forwards the data to the
configured network(s). This makes it completely transparent from the gateways
point of view and doesn't require custom software. An example of such a 
multiplexer is the [Chirpstack-packet-multiplexer](https://github.com/brocaar/chirpstack-packet-multiplexer).
Major drawback of this approach is that it requires an extra server and 
adds a single point of failure.

Follow the [instructions](https://github.com/brocaar/chirpstack-packet-multiplexer#install)
how to install the multiplexer and create the configuration. In the backend 
section you can add for each supported network a `[[packet_multiplexer.backend]]`
section. Once the [ThingsIX Forwarder](#thingsix-forwarder) runs you will 
need to add it. The multiplexer allows you to filter on gateway id. That 
means you need to specify for each backend for which gateways data must be 
forwarded. The gateway id is often printed on the device or can be found in 
it management console. If not ask the manufacturer how to obtain the gateway 
id.

:::info

If you have a firewall don't forget to open the multiplexer UDP port to make 
it accessible for the gateways.

:::

## ThingsIX forwarder {#thingsix-forwarder}
The ThingsIX forwarder is the portal for your gateways to connect with the
ThingsIX network. It contains the users gateway store and retrieves the routes
from ThingsIX that describe who is interested in data from your gateways.
ThingsIX launches with a data only network but once token support is added the 
forwarder will collect the airtime payments from end-device owners and has a 
vital role in coverage mapping. Therefore the forwarder has a gateway store 
that need to contain all your gateways. We will explain how to add your gateways 
to this store.

### Install forwarder
The first thing to decide is to determine where the forwarder will run. There 
are 2 options:
1. on the gateway, simple setup but requires to run custom software on the gateway
and enough available resources
2. on a server, requires a server to run the forwarder on

ThingsIX provides a docker image that can be found 
[here](https://github.com/ThingsIXFoundation/packet-handling/pkgs/container/packet-handling%2Fforwarder)
or if you want to build it from source you can find the repo [here](https://github.com/ThingsIXFoundation/packet-handling).
You will require [golang](https://go.dev/learn) and a C toolchain for cgo.

```bash
$ git clone https://github.com/ThingsIXFoundation/packet-handling.git
$ cd packet-handling/cmd/forwarder
$ go build
```

:::caution

If you want to run the forwarder on the gateway and you compile the forwarder 
on your desktop you will probably need to cross compile it.

:::

### Configuration
Configuration is passed with a YAML configuration file. Here is a minimal example
configuration file that you can use as a starting point for your config: 
```yaml
# forwarder configuration
forwarder:
    # backend for the gateways to connect to
    backend:
        # Semtech UDP forwarder backend
        semtech_udp:
            # ip:port to bind the UDP listener to, ensure it is accessible by the gateways
            #
            # Example: 0.0.0.0:1680 to listen on port 1680 for all network interfaces.
            udp_bind: 0.0.0.0:1680
            # Fake RX timestamp.
            #
            # Fake the RX time when the gateways do not have GPS, in which case
            # the time would otherwise be unset.
            fake_rx_time: false
    
    # Gateways that can connect to backend
    gateways:
        # Gateway store
        #
        # Gateway
        store:
            # File based gateway store.
            #
            # Full gateway store path on the file system
            file: /etc/thingsix-forwarder/gateways.yaml
        
        # Optionally record gatway local id's for gateways that are not the in
        # the store to a file. This file can later be verified and imported into 
        # the gateway store. The import command will generate an onboarding file 
        # that can be uploaded to the dashboad to onboard all of these gateways.
        record_unknown:
            # location where connected gateways that are not in the store are
            # logged.
            file: /etc/thingsix-forwarder/unknown_gateways.yaml

    # Routers to which gateway data can be forwarded to
    routers:
        # List with default routers
        #
        # Default routers are routers that will receive all gateway data and
        # don't have to be registered in the ThingsIX router registry.
        default:
            - endpoint: localhost:3200
              name: v47

        # retrieve routers from the ThingsIX router registry.
        on_chain:
            # ThingsIX router registry address
            registry: 0xA82C3D848c027F5034d833CE6B8aA2b79Ff3F655

            # retrieve router list from registry every interval
            interval: 30m

# logging related configuration
log:
    level: info      # [trace,debug,info,warn,error,fatal,panic]
    timestamp: true  # [true, false]

# everything related to blockchain and RPC node
blockchain:
    polygon:
        # Polygon node RPC endpoint
        endpoint: <RPC node endpoint>
        # Polygon chain id: 137 for mainnet, 80001 for mumbai testnet
        chain_id: 80001
        # Block confirmations, polygon blocks are final after 128 confirmations
        confirmations: 128

# optional enable metrics
metrics:
    # Enable prometheus http service
    prometheus:
        address: 0.0.0.0:8888
        path: /metrics
```

#### Configuration sections
Required configuration sections are:

- `forwarder.backend` section configures the endpoint for your gateways 
to connect on. Currently only `semtech_udp` is supported. Make sure that this 
endpoint is open for your gateways or the multiplexer that runs on a server.
- `forwarder.gateways` describes the gateway store and has its own dedicated
[section](#config-gateway-store).
- `forwarder.routes` describes where the forwarder can retrieve registered 
routes from the ThingsIX network to determine where to forward data to.
Default routes are added manually and all received data is forwarded to this 
router. `on_chain` described where the forwarder can find the routes that are 
registered on ThingsIX. `on_chain` also requires the `blockchain.polygon` 
configuration.
- `blockchain.polygon` configures the RPC Polygon endpoint to interact with 
the polygon blockchain. If you don't run your own Polygon node there are 
several providers that offer free plans that are sufficient for our needs.
[Alchemy](https://www.alchemy.com) is an example.

### Gateway store {#config-gateway-store}
This store serves multiple purposes. It acts as a filter and only forwards 
data for gateways that are in the store. In addition gateways can earn rewards
for their owner. But to earn these rewards they need to be registered in 
ThingsIX. To do so each gateway needs to be identifiable. You can find more 
information over ThingsIX identities [here](../Background/identities.md). 
Therefore the gateway store holds for all of the users gateways a mapping 
from its gateway id to a private key.
```yaml
- local_id: 0016c001f1500812
  private_key: ... 
```
The forwarder has support to create a store and add gateways to it. There are 
2 ways:
1. manually with `forwarder gateway add`
2. batch import, record gateways and import them with `forwarder gateway import`

If you only have a couple of gateways the first option is doable but if you 
have many gateways or are lazy you can also order the forwarder to record 
gateway that connected to a file and import all gateways from this file into 
the store at once.

#### Manual import
```bash
$ forwarder gateway add /path/to/gateway.store 0016c001f1500812
+---+------------------------------------------------------------------+------------------+------------------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    |
+---+------------------------------------------------------------------+------------------+------------------+
| 1 | d356d6878d427bcdbd3f0ff79c880d8454bbbd44563d712dcc343f544dd4ab51 | 0016c001f1500812 | 0be997c0ab1b952a |
+---+------------------------------------------------------------------+------------------+------------------+
```

- `THINGSIX ID`, contains the identity for this gateway as registered on ThingsIX
- `LOCAL ID`, the gateways id as known in you gateway collection
- `NETWORK ID`, the gateway id as the gateway is known on the network. It is derived
from the gateways ThingsIX identity. If you generate a new identity for the gateway 
its local id remains the same but its network id will change.

And `/path/to/gateway.store` now contains:
```yaml
- local_id: 0016c001f1500812
  private_key: 1aec73f424195cf8cbbe9627a7f1bd2fb2753c73a849906cfe8ec67edeba0b69
```

:::info

At this moment the forwarder doesn't detect store modifications. After a gateways 
is added you will need to restart the forwarder.

:::

Once token support is added and gateways need to be registered the forwarder will
get an additional subcommand to sign an onboard message that can be used in the 
ThingsIX dashboard to register the gateway.

#### Batch import
It is possible to record gateways that connect to the forwarder but are not in the 
gateway store to a file. This will fill contain a list with gateway ids. The user 
can manually verify that all gateways in this list are his and than import them in 
the gateway store at once using the `forwarder gateway import` subcommand.

This subcommand is already prepared to dump onboard messages that can be used to 
registered gateways once that is required. Therefore it requires additional 
arguments that are currently not used and can be filled with dummy values.

```bash
forwarder gateway import /path/to/gateway.store 80001 0x0000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000 recorded-unknown-gateways-file
INFO[0000] imported gateway 10abbc9eeedd470d            
INFO[0000] imported gateway e7a3a6cf4afcbbc3            
INFO[0000] imported gateway c4fceeb50989a1c0            
[{"gateway_id":"0xbd4fa58f9e41ed111bd217514dda9c99869962516e144f2b6bf4dfd9f5f75581","version":1,"local_id":"10abbc9eeedd470d","network_id":"2ea6415f4c816ba7","address":"0xfa0d1ce6afe8a732df9637058be7373cfa6fa6d7","chain_id":80001,"gateway_onboard_signature":"0xdd2c3d44ce13e4953df53360b041ec343040645a4305cff0d1f358512fa21ef76a87919390a522f756ce3cb0309ce4b058cff01440c2f6637223963a5e352a4b1c"},{"gateway_id":"0xaac0ab8487d0aca622f682892154194a6a2aed38d2476da7fd1fbff095b02403","version":1,"local_id":"e7a3a6cf4afcbbc3","network_id":"b48a5169a1054eb2","address":"0x2e04e92f54fd6aa2e2f3fc0279ebd29ec4cf3861","chain_id":80001,"gateway_onboard_signature":"0xc2a3e1a7c8a930517093568810b3c46510b8f9a63a283567abe0742d197537b41bc66ec4df6329275c8ee581542b2d4f279df9425b2ba39f120e568843da4b811c"},{"gateway_id":"0x2d20eb780634a499df7f33fb9da7cf1600530c60958e7ba6b6fa48ffdb2f2f84","version":1,"local_id":"c4fceeb50989a1c0","network_id":"ce99c693e680faf4","address":"0x564ce85954702a6d06c520847a2dff638ac1f85c","chain_id":80001,"gateway_onboard_signature":"0xe78fa87bd699235a010489344529a7771c44fd6caccbe45af900d476db763fd746a7085b238c339e5b3b4f4bb281873c586d8586e83a84286e55f7e76f451cba1b"}]
INFO[0000] imported 3 gateways, don't forget to onboard These
```
It dumps a json array with onboard message for each of the imported gateways. Once 
the ThingsIX dashboard is live and gateways need to be onboarded this json array can 
be used to onboard all gateways.

:::info

At this moment the forwarder doesn't detect store modifications. After a gateways 
is added you will need to restart the forwarder.

:::
