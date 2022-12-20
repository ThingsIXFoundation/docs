---
sidebar_position: 1
title: Installing ThingsIX forwarder
---

# Installing ThingsIX forwarder
In this guide we will explain how to configure and connect your LoRa® gateways
onto the ThingsIX network. ThingsIX is launched as a data-only network and will
add token support later (planned 2023 Q2). That means there is initially no 
reward system. As a result gateways don't have to be on-boarded and can freely 
join ThingsIX. Once token support is added you will need to on-board your 
gateways to set their details and owner to participate and earn rewards.

The ThingsIX packet forwarder is the portal for your gateways to the ThingsIX 
network. Your gateways will need to send received packets to the ThingsIX 
forwarder and the forwarder will send them to their next destination. Once 
token support is added the forwarder will try to sell the data and participate
in coverage mapping to earn rewards for its owner. The forwarder currently only 
supports [Semtech's UDP protocol](https://github.com/Lora-net/packet_forwarder/blob/master/PROTOCOL.TXT).
Therefore your gateway will need to support it or you will need to use a bridge 
that converts from your gateways protocol to Semtech's UDP protocol.

:::tip Help needed?
Head over to the [ThingsIX Discord](https://discord.gg/y93x9M7UCq) to get community support.
:::

##  Where to install the forwarder?
The first thing to decide is where to install the ThingsIX forwarder. You can run it on
the gateway or on a server. What the best solution is depends on your personal
situation. Some considerations are:
- Can you run custom software on the gateway? Do you require manufacturer support?
- Does the gateway have enough resources to run the ThingsIX forwarder? The ThingsIX forwarder is
~20MB in size and requires ~25MB of memory to operate.
- How many gateways do you need to manage? If you only have a few gateways
adding a server for the forwarder might not be worth the investment. If you have
a lot of gateways running the ThingsIX forwarder on a server may be easier to maintain. 
- How good is the gateway connectivity and what are the data costs? The 
forwarder connects with the ThingsIX network and consumes more data than just 
packet traffic. It periodically retrieves route information and keep connections
with remote routers to exchange data. If you have a limited network connection (for example 4G/LTE) it 
may be cheaper and easier to run the ThingsIX Forwarder on a server.

Once you decided where to run the forwarder it's time to install it. The 
recommended method to run the forwarder is through a docker image that you can
find [here](https://github.com/ThingsIXFoundation/packet-handling/pkgs/container/packet-handling%2Fforwarder).

We also ship binaries that you can find on the 
[release](https://github.com/ThingsIXFoundation/packet-handling/releases) page
under `Assets`.

If you prefer to build the forwarder from source you can take a look at its
[repository](https://github.com/thingsIXFoundation/packet-handling). You will
require the Golang compiler that can be found [here](https://go.dev) or install
it through your package manager. We recommended that you build the software from
an officially released version. You can find releases and their tags
[here](https://github.com/ThingsIXFoundation/packet-handling/releases).

```bash
git clone https://github.com/ThingsIXFoundation/packet-handling.git
git checkout tags/${tag}
cd packet-handling/cmd/forwarder
go build -ldflags="-s -w"
```

This guide assumes the use of the docker image.

## Quick start
Make sure the `/etc/thingsix-forwarder` folder exists on your system to store the configuration.:
```bash
mkdir -p /etc/thingsix-forwarder
```

Start the ThingsIX forwarder:
```bash
docker run --rm --name thingsix-forwarder \
  -p 1680:1680/udp \
  -v /etc/thingsix-forwarder:/etc/thingsix-forwarder \
  ghcr.io/thingsixfoundation/packet-handling/forwarder:${version}
```
(replace `${version}` with the latest [release](https://github.com/ThingsIXFoundation/packet-handling/releases), for example: `1.0.0`, note: no 'v' prefix should be used).

This example assumes that the ThingsIX forwarder listens on UDP port 1680. Make sure to open it in any firewalls and make sure to connect your gateways to it.

Wait a few minutes for ThingsIX forwarder to collect gateway EUIs: You should see a line like containing the EUI of the gateway(s) you connected:
```bash
time="2022-11-24T13:42:39Z" level=info msg="unknown gateway recorded" file=/etc/thingsix-forwarder/unknown_gateways.yaml gw_local_id=0016c001f1500812gw_local_id=0016c001f1500812
```

Press Ctrl-C to stop the ThingsIX forwarder and import the gateways to the store:

```bash
docker run --rm \
        -v /etc/thingsix-forwarder:/etc/thingsix-forwarder \
        ghcr.io/thingsixfoundation/packet-handling/forwarder:${version} \
        gateway import /etc/thingsix-forwarder/gateways.yaml 0 0x0 0x0 /etc/thingsix-forwarder/unknown_gateways.yaml
```

Now run the ThingsIX forwarder in detached mode and make sure it auto-starts when your server starts:
```bash
docker run -d --restart unless-stopped --name thingsix-forwarder \
  -p 1680:1680/udp \
  -v /etc/thingsix-forwarder:/etc/thingsix-forwarder \
  ghcr.io/thingsixfoundation/packet-handling/forwarder:${version}
```

## Detailed start

### Configuration
The forwarder comes with build in configuration for all environments. The
defaults are in most cases sufficient. But it is possible to create custom
configuration if needed. You can configure which network the forwarder needs to 
connect to with the `--net` option. By default this is `main` for mainnet, other
values are `dev`, `test` or `""` if you don't want any defaults and configure 
everything yourself.

The source repository contains an example configuration that describes all 
options and can be found [here](https://github.com/ThingsIXFoundation/packet-handling/blob/main/cmd/forwarder/example-config.yaml). 
Most should be self explanatory but the `Gateways` section require additional
explanation.

### Gateway store
The forwarder uses a gateway store that serves several purposes:

- Gateways can earn rewards for their owner. Therefore the gateway and its owner
need to be registered in ThingsIX (once token support is added). This requires 
the gateway to have an identity and the ability to proof that identity. ThingsIX
uses [ECDSA keys](../../background/identities) for identities and stores this
key together with the gateways `local_id` in the gateway store. The `local_id`
is known as the Gateway EUI and typically derived from the gateway's hardware. It
is used in the communication between the gateway and the forwarder. While the 
gateway ThingsIX network id is derived from the private key and used in the 
communication between the forwarder and the ThingsIX network.

- Your gateways need to be able to connect to the forwarder. That is often done
over the internet making this a public endpoint. The forwarder will only forward
data for gateways in its store and drops packets for unknown gateways.

- Convenience, the forwarder can be configured to record gateway id's in an
unknown gateways file (default behavior). This file can be manually verified 
and unwanted gateways can be removed. After cleanup this file can be imported in
the store. If you have many gateways this saves a lot of error prune work.

### Start forwarder
In this guide we will run the container in the foreground so it can be stopped 
and restarted from the command line. In practice you probably want to run the 
container in the background, [detached](https://docs.docker.com/engine/reference/run/#/detached--d)
and with a [restart](https://docs.docker.com/engine/reference/run/#restart-policies---restart)
policy. The forwarder opens an endpoint on port `1680/udp` for gateways to 
connect to. This port must be published. The forwarder uses 
`/etc/thingsix-forwarder` as default location where to load and store data.
Therefore we mount the local directory `/etc/thingsix-forwarder/` into the
container.

Replace `${version}` with the latest image version that can be found 
[here](https://github.com/ThingsIXFoundation/packet-handling/releases) 
(for example 1.0.0, note: no 'v' prefix should be used).

```bash
docker run -d --name thingsix-forwarder \
  -p 1680:1680/udp \
  -v /etc/thingsix-forwarder:/etc/thingsix-forwarder \
  ghcr.io/thingsixfoundation/packet-handling/forwarder:${version}
```

Now check the logs:
```bash
docker logs thingsix-forwarder
```
Output:
```bash
time="2022-11-24T12:55:32Z" level=info msg="***Starting ThingsIX Forwarder connected to mainnet***"
time="2022-11-24T12:55:32Z" level=info msg="use gateway store" path=/etc/thingsix-forwarder/gateways.yaml
time="2022-11-24T12:55:32Z" level=warning msg="accept all gateways in gateway store, including non-registered gateways"
time="2022-11-24T12:55:32Z" level=info msg="loaded gateway store" #-gateways=0
time="2022-11-24T12:55:32Z" level=info msg="Semtech UDP backend" fake_rx_time=false udp_bind="0.0.0.0:1680"
```

You will get a warning. That is normal and tells you that the forwarder accepts 
data from all gateways in the gateway store. Not only the gateways that have
been onboarded on ThingsIX since that is not required at the moment. You can
also see that the gateway store currently is empty. We will add a gateway in the
next section.

If you need to pass in custom configuration you can use the `--config` option.
Lets assume you want to rename the default gateway store from
`/etc/thingsix-forwarder/gateways.yaml` to 
`/etc/thingsix-forwarder/my-gateway-store.yaml`.

We create the following file `/etc/thingsix-forwarder/my-custom-config.yaml`:
```yaml
forwarder:
   gateways:
      store:
         file: /etc/thingsix-forwarder/my-gateway-store.yaml
```

Start the forwarder and order it to use the custom configuration file:
```bash
docker run -d --name thingsix-forwarder \
  -p 1680:1680/udp \
  -v /etc/thingsix-forwarder:/etc/thingsix-forwarder \
  ghcr.io/thingsixfoundation/packet-handling/${version} \
  --config /etc/thingsix-forwarder/my-custom-config.yaml
```

Now check the logs:
```bash
docker logs thingsix-forwarder
```
Output:
```bash
time="2022-11-24T12:57:46Z" level=info msg="***Starting ThingsIX Forwarder connected to mainnet***"
time="2022-11-24T12:57:46Z" level=info msg="use gateway store" path=/etc/thingsix-forwarder/my-gateway-store.yaml
```

### Fill gateway store
As can be seen from the logging the forwarder opens the endpoint for gateways on 
`0.0.0.0:1680/UDP`. Make sure this endpoint is accessible for your gateways and 
that your gateways uses Semtech's UDP protocol. The next step is to configure 
your gateway to use this endpoint. This is gateway specific and outside of this
guide. Please see your gateways documentation how to configure the LoRa packet forwarder
to forward packets to this endpoint.

Once you have configured your gateway to connect to the ThingsIX forwarder you
will see the following in the logs:

```bash
time="2022-11-24T13:42:39Z" level=warning msg="event from unknown gateway, drop event" gw_local_id=0016c001f1500812
time="2022-11-24T13:42:39Z" level=info msg="unknown gateway recorded" file=/etc/thingsix-forwarder/unknown_gateways.yaml gw_local_id=0016c001f1500812gw_local_id=0016c001f1500812
```

This indicates that a gateway with id `0016c001f1500812` connected to your 
forwarder but the gateway isn't in the gateway store. Therefore data from this 
gateway is dropped. It also mentions that it recorded the gateway id in 
`/etc/thingsix-forwarder/unknown_gateways.yaml`. This is default behavior, all
unknown gateway id's are recorded to this file so they can be imported if
required.

Now its time to add your gateway into the forwarders gateway store. You have 2
methods:
1. add a single gateway
2. import a set of gateways at once

#### Add single gateway
This sub command expects the gateway ID (gateway EUI) as argument
```bash
docker exec thingsix-forwarder ./forwarder gateway add 0016c001f1500812
```
Output:
```bash
+---+------------------------------------------------------------------+------------------+------------------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    |
+---+------------------------------------------------------------------+------------------+------------------+
| 1 | d418d9c7d88f582c9caadf55c50e31b787056e185d179795b3621fe90049c39c | 0016c001f1500812 | 82f25fa0a61dcd0e |
+---+------------------------------------------------------------------+------------------+------------------+
```

If the gateway was added you will see 3 id's:
- `THINGSIX ID`, once tokens support is added this is the gateway ID that needs 
to be registered on ThingsIX. It is derived from the generated gateways private
key. You can find more about ThingsIX identities [here](../../background/identities).
- `LOCAL_ID`, the is the gateway id as used for communication between gateway
and forwarder.
- `NETWORK ID`, this is the gateway id as used for communication between 
forwarder and the ThingsIX network. Just like the `THINGSIX ID` it is derived
from the gateways identity key and is compatible with the LoRa® format allowing 
it to be used in packets.

We can check that the gateway is added to the forwarders store:
```bash
cat /etc/thingsix-forwarder/gateways.yaml
```
Output:
```bash
- local_id: 0016c001f1500812
  private_key: 4f97538eda76d6e65779e655f407c6c05a44512508bc34a47f64f163b161d03d
```

#### Batch import gateways
Another method is to batch import a list of recorded gateways. Adding gateways
one by one becomes quickly a tedious job. The forwarder supports batch imports.
Gateways that are already in the store are ignored so its safe to run this
command multiple times.

This sub command is already prepared to support on-boarding gateways in ThingsIX.
Therefore it expects more arguments than when adding a single gateway. For now
you can use dummy values. Once done it prints an JSON array that can be used to 
onboard the gateways through the ThingIX dashboard. Since that isn't required it
can be ignored.

```bash
docker exec thingsix-forwarder ./forwarder gateway import 0 0x0 0x0
```
Output:
```bash
time="2022-11-24T13:49:41Z" level=info msg="imported gateway 0016c001f1500812"
time="2022-11-24T13:49:41Z" level=info msg="imported 1 gateways, don't forget to onboard these"
[{"gateway_id":"0x144542caeacd9bf9f01bac258adc1ba6ec22e49bf3f0a70d5f7b37c10cb16b03","version":1,"local_id":"0016c001f1500812","network_id":"4d7a325d4e0ee7d3","address":"0xc90b57fe9ca972d21223dae9197549ce201aeacd","chain_id":0,"gateway_onboard_signature":"0x43b20c2c3ed0cb306fdd3eb13550dd4a3cc2af162d7157289f96adeb235bc2fd6eb8234cde8d0c620acd2edb917459990dc1417c4d8fa19570fc68e1bb0048521c"}]
```
And check that the gateway is added to the gateway store.
```bash
cat /etc/thingsix-forwarder/gateways.yaml
```
Output:
```bash
- local_id: 0016c001f1500812
  private_key: 8f8127290513c3cf4f56031163285df288519c1b6527417c87b96e05abd10fa4
```

#### Gateway store overview
For an overview of gateways in the store use the `gateway list` sub command:

```bash
docker exec thingsix-forwarder ./forwarder gateway list
```
Output:
```bash
+---+------------------------------------------------------------------+------------------+------------------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    |
+---+------------------------------------------------------------------+------------------+------------------+
| 1 | 144542caeacd9bf9f01bac258adc1ba6ec22e49bf3f0a70d5f7b37c10cb16b03 | 0016c001f1500812 | 4d7a325d4e0ee7d3 |
+---+------------------------------------------------------------------+------------------+------------------+
```

#### Detecting gateways
The forwarder automatically reloads the gateway store. You can check the logging to see if the gateways are loaded.

```bash
docker logs thingsix-forwarder
```
Output:
```bash
time="2022-11-24T13:52:20Z" level=info msg="***Starting ThingsIX Forwarder connected to mainnet***"
time="2022-11-24T13:52:20Z" level=info msg="use gateway store" path=/etc/thingsix-forwarder/gateways.yaml
time="2022-11-24T13:52:20Z" level=warning msg="accept all gateways in gateway store, including non-registered gateways"
time="2022-11-24T13:52:20Z" level=info msg="loaded gateway store" #-gateways=1
...
time="2022-11-24T13:53:30Z" level=info msg="gateway online" gw_local_id=0016c001f1500812 gw_network_id=4d7a325d4e0ee7d3
...
time="2022-11-24T13:54:11Z" level=info msg="delivered packet" airtime="113.152µs" coderate=CR_4_5 dev_addr=00b00b1e ...
```

### Backup and security of the gateway store
Since the gateway store holds the private key for each gateway it is important
to make a backup of the gateway store. If the store is lost you will need to
import the gateways again in a new store. This generates new keys forcing you
to onboard the gateways again on ThingsIX when token support is added. 
Onboarding gateways and setting gateway details comes with a fee that needs to 
be paid again. Therefore loosing your gateway store will come with a price.

Gateways that are onboarded on ThingsIX are stored in your Polygon wallet. If
someone captures your gateway store it is not possible to take ownership of 
these gateways. That can only happen if someone gains access to your Polygon
wallet.
