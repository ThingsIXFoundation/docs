---
sidebar_position: 3
title: Installing ThingsIX Forwarder
---

# Installing ThingsIX Forwarder
In this guide we will explain how to configure and connect your LoRa® gateways
onto the ThingsIX network. The ThingsIX packet forwarder is the portal for your gateways to the ThingsIX 
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
Make sure the `/etc/thingsix-forwarder` folder exists on your system to store
the configuration and is writeable by the docker container:

```bash
mkdir -p /etc/thingsix-forwarder
```

Start the ThingsIX forwarder on mainnet:
```bash
docker run -d --name thingsix-forwarder \
  -p 1680:1680/udp \
  --restart unless-stopped \
  -v /etc/thingsix-forwarder:/etc/thingsix-forwarder \
  ghcr.io/thingsixfoundation/packet-handling/forwarder:${version}
```
(replace `${version}` with the latest [release](https://github.com/ThingsIXFoundation/packet-handling/releases), for example: `1.1.0`, note: no 'v' prefix should be used).

This example assumes that the ThingsIX forwarder listens on UDP port 1680. Make sure to open it in any firewalls and make sure to connect your gateways to it.

Wait a few minutes for ThingsIX forwarder to collect gateway EUIs: You should see a line like containing the EUI of the gateway(s) you connected if you run:
```bash
docker logs thingsix-forwarder
``` 
Like:
```bash
time="2022-11-24T13:42:39Z" level=info msg="unknown gateway recorded" file=/etc/thingsix-forwarder/unknown_gateways.yaml gw_local_id=0016c001f1500812
```
With the default configuration the forwarder will write recorded unknown
gateway id's to `/etc/thingsix-forwarder/unknown_gateways.yaml`.

```bash
cat /etc/thingsix-forwarder/unknown_gateways.yaml
- local_id: 0016c001f1500812
  first_seen: 1677672688
```

Now you can import the gateways:

```bash
docker exec thingsix-forwarder ./forwarder gateway import-and-push <owner>
```

`owner` is the wallet address of the gateway owner. This will be the address
that onboards the gateway in ThingsIX.

Example:
```bash
docker exec thingsix-forwarder ./forwarder gateway import-and-push 0016c001f1500812 0x782123189312Aa15c2C50A87F7Fe737DE38f3569 
```

For every recorded gateway the forwarder generates an identity and stores it  with the gateways local id in the gateway store. It automatically pushes the onboarding records  to the ThingsIX Web App where it can be used to onboard your gateway(s), see: [Onboarding Gateway](./onboarding-gateway.md).

If you want to onboard a single gateway or want to push a onboarding message again to the ThingsIX Web App you can use `onboard-and-push`:

```bash
docker exec thingsix-forwarder ./forwarder gateway onboard-and-push <local gatewayid > <owner>
```

`owner` is the wallet address of the gateway owner. This will be the address
that onboards the gateway in ThingsIX.

Example:
```bash
docker exec thingsix-forwarder ./forwarder gateway onboard-and-push <local gatewayid > <owner>
```


:::info
After the gateways are imported in the forwarders gateway store their identity
is stored in `/etc/thingsix-forwarder/gateways.yaml`. Make a backup of this file
since it contains the identity of your gateways. If you need to reinstall the
forwarder you can copy this file back to the same location.
:::

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
Therefore we mount the local directory `/etc/thingsix-forwarder` into the
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

If you want to start the forwarder with default configuration on another network
just append `--net=<network>` to the command with network one of `dev`, `test`
or `main`. The default is `main`.

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
  --restart unless-stopped \
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
time="2022-11-24T13:42:39Z" level=info msg="unknown gateway recorded" file=/etc/thingsix-forwarder/unknown_gateways.yaml gw_local_id=0016c001f1500812 gw_local_id=0016c001f1500812
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
2. import recorded unknown gateways all at once

#### Add single gateway
Add the gateway to the forwarder and generate the onboard message that is
required when onboarding the gateway in ThingsIX. 
```bash
docker exec thingsix-forwarder ./forwarder gateway onboard <local gateway id> <wallet address>
```
Enter your own local gateway id and wallet address, for example:
```bash
docker exec thingsix-forwarder ./forwarder gateway onboard 0016c001f1500812 0x782123189312Aa15c2C50A87F7Fe737DE38f3569 2> /dev/null
```

Output:
```bash
+---+------------------------------------------------------------------+------------------+------------------+-------+---------+--------------+----------+----------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    | OWNER | VERSION | ANTENNA GAIN | LOCATION | ALTITUDE |
+---+------------------------------------------------------------------+------------------+------------------+-------+---------+--------------+----------+----------+
| 1 | 4bcbcefa9c366c5752dfaca183233ce4ee32507976fc0a90f8659919c18cf20b | 0016c001f1500812 | f7165c83376b6562 |       |         |              |          |          |
+---+------------------------------------------------------------------+------------------+------------------+-------+---------+--------------+----------+----------+
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
  private_key: 82f8285f735fac86859ef590ec7109380b5406e2c5a8b3036a79262df1455824
```

#### Batch import gateways
Another method is to batch import a list of recorded gateways. Adding gateways
one by one becomes quickly a tedious job. The forwarder and the ThingsIX
dashboard support batch imports. Gateways that are already in the store are 
ignored so its safe to run this command multiple times.

The gateway import command accepts the owners wallet address.

The forwarder will dump a json message that is required in the dashboard to
onboard all gateways at once.

```bash
docker exec thingsix-forwarder ./forwarder gateway import 0x782123189312Aa15c2C50A87F7Fe737DE38f3569 2>/dev/null
```

Output:
```bash        
[{"owner":"0x782123189312aa15c2c50a87f7fe737de38f3569","address":"0x4b9c21e41993b744bc9d42fa9bf95ec6e7d0ab52","chainId":80001,"gatewayId":"0x6324cc1948f59786cb821dd2183417c9eaafcd0dc685bb7cbaf8d1896c4e94f6","gatewayOnboardSignature":"0x516d64b246ce15f23549d5aa13159f578e44e706122fd2649025b117fd5738c01e0ed5a1ae3305e9c0412308e435e638e0ddb86c931d570367d76d97e467d7a41b","localId":"0016c001f1500812","networkId":"9275be1b7e8cc041","version":123,"onboarder":"0xa9f2f4f130541e32209ce04950b6978e8dd97043"}]
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
| 1 | 6324cc1948f59786cb821dd2183417c9eaafcd0dc685bb7cbaf8d1896c4e94f6 | 0016c001f1500812 | 9275be1b7e8cc041 |
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

### List gateways in store
```bash
docker exec thingsix-forwarder ./forwarder gateway list 2>/dev/null
```

Output
```bash
+---+------------------------------------------------------------------+------------------+------------------+-------+---------+--------------+----------+----------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    | OWNER | VERSION | ANTENNA GAIN | LOCATION | ALTITUDE |
+---+------------------------------------------------------------------+------------------+------------------+-------+---------+--------------+----------+----------+
| 1 | 43f69867ee7cac637f998f80b89928eb79a5c57b40c5fd2f73c4d8ea86efa180 | 0016c001f1500812 | 5b8c0be32c9e0a2c |       |         |              |          |          |
+---+------------------------------------------------------------------+------------------+------------------+-------+---------+--------------+----------+----------+
```
This command supports the `--json` flag. If given the output is printed as a
json value.

If the last columns are missing it means that the gateway hasn't been onboarded
and/or its details are not set. If that has been done the forwarder may need to
sync with ThingsIX. That will happen automatically but can take some time.

### Create gateway onboard message
Each gateway needs to be onboarded. This requires the gateway's identity that
the forwarder manages in its store. To generate an onboard message for a gateway
use the following command:

```bash
docker exec thingsix-forwarder ./forwarder gateway onboard 0016c001f1500812 0x782123189312Aa15c2C50A87F7Fe737DE38f3569 2>/dev/null
```

The first argument is the gateways local id for which you want to generate an
onboard message the last argument is the gateways owner wallet address. It is
safe to run this command multiple times if needed.

Output
```bash
+---+--------------------------------------------------------------------+------------------+--------------------------------------------+---------+--------------------------------------------------------------------------------------------------------------------------------------+
|   |                             GATEWAY ID                             |     LOCAL ID     |                   OWNER                    | VERSION |                                                      GATEWAY ONBOARD SIGNATURE                                                       |
+---+--------------------------------------------------------------------+------------------+--------------------------------------------+---------+--------------------------------------------------------------------------------------------------------------------------------------+
| 1 | 0x43f69867ee7cac637f998f80b89928eb79a5c57b40c5fd2f73c4d8ea86efa180 | 0016c001f1500812 | 0x782123189312Aa15c2C50A87F7Fe737DE38f3569 |       0 | 0xee2ab6038d1047ba5b4680e500bbf29b4f78ad5ba6dfd90a32ba5c192e811fab409c7a716dd404fb31423c2ee21e7dc7d162b0bc2e962718973fcc72f6a87f3f1b |
+---+--------------------------------------------------------------------+------------------+--------------------------------------------+---------+--------------------------------------------------------------------------------------------------------------------------------------+
```
You will need this information when onboarding the gateway.

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
