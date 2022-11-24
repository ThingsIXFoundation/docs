---
sidebar_position: 2
title: ThingsIX packet forwarder
---

# Introduction
The ThingsIX packet forwarder is the portal for your gateways to the ThingsIX 
network. Your gateways will need to send received packets to the ThingsIX 
forwarder and the forwarder will send them to their next destination. Once 
token support is added the forwarder will try to sell the data and gather 
rewards for its owner. It will also play a fundamental role in coverage mapping.
The forwarder currently only supports [Semtech's UDP protocol](https://github.com/Lora-net/packet_forwarder/blob/master/PROTOCOL.TXT).
So your gateway will need to support that protocol or you will need to use a
bridge that converts from the protocol your gateway uses to Semtech's UDP 
format.

## Install forwarder
The first thing to decide is where to install the forwarder. You can run it on
the gateway or on a server. What the best solution is depends on your personal
situation. Some considerations are:
- allows the gateway to run custom software? Do you require manufacturer support?
- has the gateway enough resources to run an extra service? The forwarder is
~20MB in size and requires ~25MB of memory to operate.
- how many gateways do you need to manage? If you have only a few gateways
adding a server might be not worth the investment.
- how good is the gateway connectivity and what are the data costs? The 
forwarder connects with the ThingsIX network and consumes more data than just 
packet traffic. It periodically retrieves route information and keep connections
with remote routers to exchange data.

Once you decided where to run the forwarder its time to install it. The 
recommended method to run the forwarder is through a docker image that you can
find [here](https://github.com/ThingsIXFoundation/packet-handling/pkgs/container/packet-handling%2Fforwarder).

If you prefer to build the forwarder from source you can take a look at its
[repository](https://github.com/thingsIXFoundation/packet-handling). You will
require the Golang compiler that can be found [here](https://go.dev) or install
it through your package manager. You can find official releases with their tags
[here](https://github.com/ThingsIXFoundation/packet-handling/releases).

```bash
$ git clone https://github.com/ThingsIXFoundation/packet-handling.git
$ git checkout tags/${tag}
$ cd packet-handling/cmd/forwarder
$ go build -ldflags="-s -w"
```

## Configuration
The forwarder offers an `--net` flag that can be used to start the forwarder
with default settings for given environment. Supported environment are `dev`, 
`test`, `main` or `""` in case you don't want to use a default configuration and 
configure everything through explicit configuration. If you don't require custom
configuration using the `--net <network>` is the most convenient method.

The source repository contains an example configuration that describes all 
options and can be found [here](https://github.com/ThingsIXFoundation/packet-handling/blob/main/cmd/forwarder/example-config.yaml). Most should be self explanatory but the 
`Gateways` section require additional explanation.

### Gateway store
The forwarder uses a gateway store that serves several purposes:

- gateways can earn rewards for their owner. Therefore the gateway and its owner
need to be registered in ThingsIX (once token support is added). This requires 
the gateway to have an identity and the ability to proof that identity. ThingsIX
uses [ECDSA keys](../../background/identities.md) for identities and stores this
key together with the gateways `local_id` in the gateway store. The `local_id`
is known as the gateway id and typically derived from the gateway's hardware. It
is used in the communication between the gateway and the forwarder. While the 
gateway ThingsIX network id is derived from the private key and used in the 
communication between the forwarder and the ThingsIX network.

- your gateways need to be able to connect to the forwarder. That is often done
over the internet making this a public endpoint. The forwarder will only forward
data for gateways in its store and drops packets for unknown gateways.

- convenience, the forwarder can be configured to record gateway id's in an
unknown gateways file (default behavior). This file can be manually verified 
and unwanted gateways can be removed. After cleanup this file can be imported in
the store. If you have many gateways this saves a lot of error prune work.

## Start forwarder
You can pass custom configuration using the `--config` option. In this guide
we will start the forwarder on mainnet with the default configuration and an 
empty gateway store where we will add a gateway later.

```bash
$ ./forwarder --net main
INFO[2022-11-24T09:37:34+01:00] ***Starting ThingsIX Forwarder connected to mainnet***
INFO[2022-11-24T09:37:34+01:00] use gateway store                             path=/etc/thingsix-forwarder/gateways.yaml
WARN[2022-11-24T09:37:34+01:00] accept all gateways in gateway store, including non-registered gateways
INFO[2022-11-24T09:37:34+01:00] loaded gateway store                          #-gateways=0
INFO[2022-11-24T09:37:34+01:00] Semtech UDP backend                           fake_rx_time=false udp_bind="0.0.0.0:1680"
```

You will see a warning. That is normal and informs you that the forwarder 
accepts data from gateways that are in the gateway store but don't have to be 
onboarded on ThingsIX since that is currently not required.

:::caution
All default configurations will use the gateway store and record unknown 
gateways on the same file location. Be careful starting the forwarder on the
same machine with different networks since they share the same gateway store 
files. If you have separate gateways for the environment either use a custom 
configuration, run the forwarder on different machines, or use a docker image 
and use network unique volumes for `/etc/thingsix-forwarder`.
:::

## Gateway store
As can be seen from the logging the forwarder opens the endpoint for gateways on 
`0.0.0.0:1680/UDP`. Make sure this endpoint is accessible for your gateways and 
that your gateways use Semtech's UDP protocol. The next thing is to configure 
your gateway to use this endpoint. This is gateway specific and outside of this
guide. Please see your gateways documentation how to configure the endpoint.

Once you have configured your gateway to connect to the ThingsIX forwarder you
will see the following in the logs:

```bash
WARN[2022-11-24T10:25:15+01:00] event from unknown gateway, drop event        gw_local_id=0016c001f1500812
INFO[2022-11-24T10:25:15+01:00] unknown gateway recorded                      file=/etc/thingsix-forwarder/unknown_gateways.yaml gw_local_id=0016c001f1500812
```

This indicates that a gateway with id `0016c001f1500812` connected to your 
forwarder but the gateway isn't in the gateway store. Therefore data from this 
gateway is dropped. It also mentions that it recoreded the gateway id in 
`/etc/thingsix-forwarder/unknown_gateways.yaml`. This is default behavior, all
unknown gateway id's are recorded to this file so they can be imported if
required.

Now its time to add your gateway into the forwarders gateway store. You have 2
methods:
1. add a single gateway
2. import a set of gateways at once

### Add single gateway
This sub command expects 2 arguments:
1. the gateway store file, its default location is `/etc/thingsix-forwarder/gateways.yaml`
2. the gateway id

```bash
$ ./forwarder gateway add /etc/thingsix-forwarder/gateways.yaml 0016c001f1500812
+---+------------------------------------------------------------------+------------------+------------------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    |
+---+------------------------------------------------------------------+------------------+------------------+
| 1 | 675f08816d81c78dba7f494a97116a94635cec28b4ebaa0943c0446c89019833 | 0016c001f1500812 | ed90aad87fa13a27 |
+---+------------------------------------------------------------------+------------------+------------------+
```
If the gateway was added you will see 3 id's:
- `THINGSIX ID`, once tokens support is added this is the gateway ID that needs 
to be registered on ThingsIX. It is derived from the generated gateways private
key. You can find more about ThingsIX identities [here](../../background/identities.md).
- `LOCAL_ID`, the is the gateway id as used for communication between gateway
and forwarder.
- `NETWORK ID`, this is the gateway id as used for communication between 
forwarder and the ThingsIX network. Just like the `THINGSIX ID` it is derived
from the gateways identity key and is compatible with the LoRa® format allowing 
it to be used in packets.

We can check that the gateway is added to the forwarders store:
```bash
$ cat /etc/thingsix-forwarder/gateways.yaml
- local_id: 0016c001f1500812
  private_key: 7c1f3f7b2c0de8e6983ee4d06426b3dd15173bc365275f407a5897694d4361d2
```

:::info
Currently the forwarder is not smart enough to detect gateway store changes and
reload them while running. After you added/removed a gateway from the store the
forwarder needs to be restarted.
:::

### Batch import gateways
Another method is to batch import a list of recorded gateways. If you have many 
gateways to add to the gateway store adding them one by one is tedious job. The 
forwarder therefore supports batch imports. Gateways that are already in the
store are ignored.

This sub command is already prepared to support on-boarding gateways in ThingsIX.
Therefore it expects more arguments that can be set to dummy values. It also 
prints an JSON array that can be used to onboard the gateways later through 
the ThingIX dashboard. Since that isn't required it can be ignored.

```bash
$ ./forwarder gateway import /etc/thingsix-forwarder/gateways.yaml 0 0x0 0x0 /etc/thingsix-forwarder/unknown_gateways.yaml
INFO[0000] imported gateway 0016c001f1500812
[{"gateway_id":"0x7f1cc3b5c4e798a18f66cf902571f935ce2f627eb37ccf79850decf18a919645","version":1,"local_id":"0016c001f1500812","network_id":"45260200c6bc99ac","address":"0xf122143b7c176b7e86bb001e2176ef0491326af3","chain_id":0,"gateway_onboard_signature":"0xa37513b9085ba0fd513b34fd3e530df9d35317b60d2c53f64cba25f54a9a031428239cf6cfbaebfc9f1aab7bd3611702070de8adee769906646fb549b7e5be5c1b"}]
INFO[0000] imported 1 gateways, don't forget to onboard these
```
And check that the gateway is added to the gateway store.
```bash
$ cat /etc/thingsix-forwarder/gateways.yaml
- local_id: 0016c001f1500812
  private_key: 5487847f269e31515b6509a49bf0e4f0cd421c5c777058ee21ced22677502f9e
```

### Gateway store overview
For an overview of gateways in the store use the `gateway list` sub command:

```bash
$ ./forwarder gateway list /etc/thingsix-forwarder/gateways.yaml
+---+------------------------------------------------------------------+------------------+------------------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    |
+---+------------------------------------------------------------------+------------------+------------------+
| 1 | 7f1cc3b5c4e798a18f66cf902571f935ce2f627eb37ccf79850decf18a919645 | 0016c001f1500812 | 45260200c6bc99ac |
+---+------------------------------------------------------------------+------------------+------------------+
```

### Restart forwarder
After the forwarder is restarted it should now log that it loaded the gateway
store with your gateway(s). Once one of your gateways connect you will see an
online statement in the logs indicating that its a known gateway and that it 
will forward packets to the ThingsIX network.

```bash
$ ./forwarder --net main
INFO[2022-11-24T10:53:53+01:00] ***Starting ThingsIX Forwarder connected to mainnet***
INFO[2022-11-24T10:53:53+01:00] use gateway store                             path=/etc/thingsix-forwarder/gateways.yaml
WARN[2022-11-24T10:53:53+01:00] accept all gateways in gateway store, including non-registered gateways
INFO[2022-11-24T10:53:53+01:00] loaded gateway store                          #-gateways=1
...
INFO[2022-11-24T10:53:56+01:00] gateway online                                gw_local_id=0016c001f1500812 gw_network_id=45260200c6bc99ac
...
INFO[2022-11-24T10:57:22+01:00] delivered packet                              airtime="113.152µs" coderate=CR_4_5 dev_addr=00b00b1e ...
```

