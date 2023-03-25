---
sidebar_position: 1
title: Install ThingsIX forwarder
---

# Install ThingsIX forwarder
In this guide we will explain how to configure and connect your LoRa® gateways
onto the ThingsIX network. ThingsIX is launched as a data-only network and will
add token support later (planned 2023 Q2). That means there is initially no 
reward system. As a result gateways don't have to be on-boarded and can freely 
join ThingsIX. Once token support is added you will need to on-board your 
gateways to set their details and owner to participate and earn rewards.

The ThingsIX packet forwarder is the access portal for your gateways to the
ThingsIX network. Your gateways will need to send received packets to the
ThingsIX forwarder and the forwarder will send them to their next destination.
Once token support is added the forwarder will try to sell the data and
participate in coverage mapping to earn rewards for its owner. The forwarder
currently supports [Semtech's UDP protocol](https://github.com/Lora-net/packet_forwarder/blob/master/PROTOCOL.TXT)
and limited support for LoRa Basics™ Station.

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
  ghcr.io/thingsixfoundation/packet-handling/forwarder:${version} --default_frequency_plan=EU868
```
(replace `${version}` with the latest [release](https://github.com/ThingsIXFoundation/packet-handling/releases), for example: `1.0.0`, note: no 'v' prefix should be used). 

From version 1.0.8 onwards the flags for the frequency plan are required:  --default_frequency_plan=EU868 or  --default_frequency_plan=AU915 (of course you can set other plans too, but there currently aren't any routers on mainnet for that).

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

Now you can import the gateways and send the onboard message to ThingsIX:

```bash
docker exec thingsix-forwarder ./forwarder gateway import-and-push <owner>
```

`owner` is your personal wallet address that you will import the gateways in and
receive earned rewards.

This command will generate for each recorded gateway that it imports into the
forwarders gateway store an identity and uses this identity to generate an
onboard message that is send to ThingsIX. It will also print the onboard message
if you want to copy it manually. ThingsIX will store the onboard message for 4
hours. In this period you can go to the ThingsIX dashboard, connect your wallet
and onboard the gateway. If you cannot do this within the 4 hours you will
need to copy the onboard message yourself into the dashboard.

Example:
```bash
docker exec thingsix-forwarder ./forwarder gateway import-and-push 0x094cab3ecd74ee71fc583cf737dbc474f72301b0
```
Output (onboard message that was also sent to ThingsIX):
```bash
[{"address":"0x8ff8d3cc8563d01f5a08c7a3c5210464400ebe7e","chainId":80001,"gatewayId":"0x41e5d017723d2f8634f7b146f2c3d1d4691eb9fdd3c8dae801fa1bffed04ccd1","localId":"0016c001f1500812","networkId":"ce791683c0474aa9","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0x376110ecfcebd9a477500c8ba2d812235808e4c5ac41d58c64f2f754f52e7f014dca307aac94242871d939ef4b24ba769e3ef5ffc8daded8b9929d9d195d2c421b","version":0}]
```

It is safe to run this command multiple times. Gateways that are already
imported will be ignored.

:::info
After the gateways are imported in the forwarders gateway store their identity
is stored in `/etc/thingsix-forwarder/gateways.yaml`. Make a backup of this file
since it contains the identity of your gateways. If you need to reinstall the
forwarder you can copy this file back to the same location.
:::

Now you are all done to onboard your gateways on ThingsIX in our dashboard. See
for instructions [this](./4_onboard_gateway.md) page.

## Detailed start

### Configuration
The forwarder comes with build in configuration for all environments. The
defaults are in most cases sufficient. But it is possible to create custom
configuration when needed. You can configure which network the forwarder needs
to connect to with the `--net` option. By default this is `main` for mainnet,
other values are `dev`, `test` or `""` if you don't want any defaults and
configure everything yourself.

The source repository contains an example configuration that describes all 
options and can be found [here](https://github.com/ThingsIXFoundation/packet-handling/blob/main/cmd/forwarder/example-config.yaml). 
Most should be self explanatory but the `Gateways` section require additional
explanation.

:::info
By default the forwarder only connects to routers that are registered for a
frequency plan that at least 1 of the gateways in the forwarders store uses.
This prevents forwarders to connect to routers for which it will never receive
traffic.

You can set a default frequency plan for gateways that are not yet fully
onboarded through custom configuration under the key
`forwarder.gateways.store.default_frequency_plan: <freq-plan>`. See the [example
config](https://github.com/ThingsIXFoundation/packet-handling/blob/main/cmd/forwarder/example-config.yaml)
for an example.
:::

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
2. import recorded unknown gateways all at once

#### Add single gateway
Add the gateway to the forwarder and generate the onboard message that is
required when onboarding the gateway in ThingsIX.
```bash
docker exec thingsix-forwarder ./forwarder gateway onboard-and-push 0016c001f1500812 0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56
```

Output:
```bash
+---+--------------------------------------------------------------------+------------------+--------------------------------------------+---------+--------------------------------------------------------------------------------------------------------------------------------------+
|   |                             GATEWAY ID                             |     LOCAL ID     |                   OWNER                    | VERSION |                                                      GATEWAY ONBOARD SIGNATURE                                                       |
+---+--------------------------------------------------------------------+------------------+--------------------------------------------+---------+--------------------------------------------------------------------------------------------------------------------------------------+
| 1 | 0x876014aadd2ab2986e86d1963236321d035c4f6be067d64f156334c46793fc1d | 0016c001f1500812 | 0xAB9bAA9B464C1Ac323e44fc803dbd6Ef3AB1BE56 |       0 | 0x9dae16d11e71f9115be0d45c417e0ce20e5b60b618e99ec223afd2dd56d9cda4235f872ff45e13af71f6aeb7030d3719c2e62e279db0bf8ca20f6cb8ee55c28f1c |
+---+--------------------------------------------------------------------+------------------+--------------------------------------------+---------+--------------------------------------------------------------------------------------------------------------------------------------+
```

If the gateway was added you will see 2 id's:
- `THINGSIX ID`, once tokens support is added this is the gateway ID that needs 
to be registered on ThingsIX. It is derived from the generated gateways private
key. You can find more about ThingsIX identities [here](../../background/identities).
- `LOCAL_ID`, the is the gateway id as used for communication between gateway
and forwarder.

We can check that the gateway is added to the forwarders store:
```bash
cat /etc/thingsix-forwarder/gateways.yaml
```
Output:
```bash
- local_id: 0016c001f1500812
  private_key: 45c205d94851f92d2afc9be71c4dfa93bc37e9fd6666ad22158b40f3cd9d6f60
```

#### Batch import gateways
Another method is to batch import a list of recorded gateways. Adding gateways
one by one becomes quickly a tedious job. The forwarder and the ThingsIX
dashboard support batch imports. Gateways that are already in the store are 
ignored so its safe to run this command multiple times.

The gateway import command accepts the owners wallet address.

The forwarder will dump a json message that contains the gateway onboard
message that are pushed to ThingsIX.

```bash
docker exec thingsix-forwarder ./forwarder gateway import-and-push 0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56
```

Output:
```bash        
[{"address":"0xd5a9a02d571feeb44b837bf2c352b1158db5bfee","chainId":80001,"gatewayId":"0xcb932d6756f98908b4bfc6fc0d56102f1cd1516398fa1d89497b40057928767c","localId":"0016c001f1500812","networkId":"e50dd8b564f2cc77","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0xd52a2bcf9bb76b80ecbed7864ad75bd9bad75acf3be49acfceeaf62f1d96517416dc00e629db2abb7adc1d6fe44db24edf1dfb07afcc90a84520bd27cbaae1761b","version":0},{"address":"0x4a2bcbccf30e43d7f684a4a36c3478bf1aa5f751","chainId":80001,"gatewayId":"0xa2da563b73e89b4e0c61482691a4a308e053800fa764a257f36c88c658f95162","localId":"aa16c001f1500812","networkId":"1421046d7bb45934","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0xb82c35632597a0d302d1cbcf7e1169fd287c0ec4931e0845cf16ad52917ee4131fcb4ff8cc11368ddaf1edb3225136e48627bd862dcf31c24b0f04281f0bdf651c","version":0},{"address":"0x22f36eedcd609ae7a04bf0dfcb615b8c2946e77d","chainId":80001,"gatewayId":"0xe0e10b9d6c4c725a86d689f3d26b709c99a08e85727c77b34256b97724e0c718","localId":"ba16c001f1500812","networkId":"51fb370310db16b2","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0x323ea47c9860e5bd91f8defcd7f1c3bd82e2c64714115b2a1eed2db01e7ab712533095ac5ea96ad4fbd4c88344c059b01f3385d6ee68aa749510718c67718cc71b","version":0},{"address":"0xc7ef3801235a8624c02f6ce081b8c87e23f3b973","chainId":80001,"gatewayId":"0xf77746cfaabb85efb8ee6ce5e67529509b6a0ec856d1a3ae5eb8dede9f7f3ca9","localId":"ca16c001f1500812","networkId":"b2396e5d8ecf82b0","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0x9ab439c28b1e1f0580bd4774791e68e01811112a9176a2db0ebe162762da18533dfec867eaed4ebabc7075b877d6e02dd7a025260d835c97300abfe0a74ff9911c","version":0},{"address":"0x6465ce06f45e8e12331c9cb37b9ebbf1cadd02d1","chainId":80001,"gatewayId":"0xc13d2d3b4ce902dd4190ac13c3f86f79b41a000774c9ae2a069f54bf41ecef5e","localId":"da16c001f1500812","networkId":"b63b0ed382ac6ebb","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0xb329e1363bc12924792e9390226df4a99efc32e055f9ca14390e86cb10024b0a4a0e5a5a0d56899efd452c0ef410c8130826935accb2b2694d1f6f859de3cacd1b","version":0}]
```

And check that the gateways are added to the gateway store.
```bash
cat /etc/thingsix-forwarder/gateways.yaml
```
Output:
```bash
- local_id: 0016c001f1500812
  private_key: b598b56d5fd02763ebe702f0800f9e8600213fe1cff9bf0f50d10ee2da27028d
- local_id: aa16c001f1500812
  private_key: fd5af545bdc224eee839c14c3931ba99198e10a646ffc87acbe43978ac903786
- local_id: ba16c001f1500812
  private_key: f297568fa3954ab38b275af93e137c8016da8ffd8e0f471a5419a67f5b613c39
- local_id: ca16c001f1500812
  private_key: 636bd3d58e3b5909a1ef1358eb3ecdf9084f0824a03fc03e8a5be476352e6c77
- local_id: da16c001f1500812
  private_key: 5c641438d37ad0be09c527e3a3c3bfa4a1a58f20db3dac1ac313748a66961705
```

#### Gateway store overview
For an overview of gateways in the store use the `gateway list` sub command:

```bash
docker exec thingsix-forwarder ./forwarder gateway list
```
Output:
```bash
+---+------------------------------------------------------------------+------------------+------------------+-------+------+---------+--------------+----------+----------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    | OWNER | BAND | VERSION | ANTENNA GAIN | LOCATION | ALTITUDE |
+---+------------------------------------------------------------------+------------------+------------------+-------+------+---------+--------------+----------+----------+
| 1 | cb932d6756f98908b4bfc6fc0d56102f1cd1516398fa1d89497b40057928767c | 0016c001f1500812 | e50dd8b564f2cc77 |       |      |         |              |          |          |
| 2 | a2da563b73e89b4e0c61482691a4a308e053800fa764a257f36c88c658f95162 | aa16c001f1500812 | 1421046d7bb45934 |       |      |         |              |          |          |
| 3 | e0e10b9d6c4c725a86d689f3d26b709c99a08e85727c77b34256b97724e0c718 | ba16c001f1500812 | 51fb370310db16b2 |       |      |         |              |          |          |
| 4 | f77746cfaabb85efb8ee6ce5e67529509b6a0ec856d1a3ae5eb8dede9f7f3ca9 | ca16c001f1500812 | b2396e5d8ecf82b0 |       |      |         |              |          |          |
| 5 | c13d2d3b4ce902dd4190ac13c3f86f79b41a000774c9ae2a069f54bf41ecef5e | da16c001f1500812 | b63b0ed382ac6ebb |       |      |         |              |          |          |
+---+------------------------------------------------------------------+------------------+------------------+-------+------+---------+--------------+----------+----------+
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
docker exec thingsix-forwarder ./forwarder gateway list
```

Output
```bash
+---+------------------------------------------------------------------+------------------+------------------+-------+------+---------+--------------+----------+----------+
|   |                           THINGSIX ID                            |     LOCAL ID     |    NETWORK ID    | OWNER | BAND | VERSION | ANTENNA GAIN | LOCATION | ALTITUDE |
+---+------------------------------------------------------------------+------------------+------------------+-------+------+---------+--------------+----------+----------+
| 1 | cb932d6756f98908b4bfc6fc0d56102f1cd1516398fa1d89497b40057928767c | 0016c001f1500812 | e50dd8b564f2cc77 |       |      |         |              |          |          |
| 2 | a2da563b73e89b4e0c61482691a4a308e053800fa764a257f36c88c658f95162 | aa16c001f1500812 | 1421046d7bb45934 |       |      |         |              |          |          |
| 3 | e0e10b9d6c4c725a86d689f3d26b709c99a08e85727c77b34256b97724e0c718 | ba16c001f1500812 | 51fb370310db16b2 |       |      |         |              |          |          |
| 4 | f77746cfaabb85efb8ee6ce5e67529509b6a0ec856d1a3ae5eb8dede9f7f3ca9 | ca16c001f1500812 | b2396e5d8ecf82b0 |       |      |         |              |          |          |
| 5 | c13d2d3b4ce902dd4190ac13c3f86f79b41a000774c9ae2a069f54bf41ecef5e | da16c001f1500812 | b63b0ed382ac6ebb |       |      |         |              |          |          |
+---+------------------------------------------------------------------+------------------+------------------+-------+------+---------+--------------+----------+----------+
```
This command supports the `--json` flag. If given the output is printed as a
json value.

If the last columns are missing it means that the gateway hasn't been onboarded
and/or its details are not set. If that has been done the forwarder may need to
sync with ThingsIX. That will happen automatically but can take some time.

### Create gateway onboard message
If you want to (re)create a gateway onboard message for an already onboarded
gateway or want to copy the onboard message manually you can use the `onboard`
subcommand.

```bash
docker exec thingsix-forwarder ./forwarder gateway onboard 0016c001f1500812 0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56  --json
```

The first argument is the gateways local id for which you want to generate an
onboard message the last argument is the gateways owner wallet address. It is
safe to run this command multiple times if needed.

Output
```bash
[{"address":"0xd5a9a02d571feeb44b837bf2c352b1158db5bfee","chainId":80001,"gatewayId":"0xcb932d6756f98908b4bfc6fc0d56102f1cd1516398fa1d89497b40057928767c","localId":"0016c001f1500812","networkId":"e50dd8b564f2cc77","owner":"0xab9baa9b464c1ac323e44fc803dbd6ef3ab1be56","signature":"0xd52a2bcf9bb76b80ecbed7864ad75bd9bad75acf3be49acfceeaf62f1d96517416dc00e629db2abb7adc1d6fe44db24edf1dfb07afcc90a84520bd27cbaae1761b","version":0}]
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
