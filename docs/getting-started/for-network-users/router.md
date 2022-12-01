---
sidebar_position: 3
---

# Installing ThingsIX router
The ThingsIX router is used to receive packets from ThingsIX forwarders that are intended for your NetID or DevAddr-prefix+mask (we will use NetID from now on in this guide, but everywhere the DevAddr is also applicable). This allows a LoRaWAN® network operator to use all the gateways available on the ThingsIX network to build or extend it's network. Currently using the ThingsIX network is free. Later the used airtime will need to be paid. 

:::tip Help needed?
Head over to the [ThingsIX Discord](https://discord.gg/y93x9M7UCq) to get community support. Or contact `info@thingsix.com` for options for dedicated support. 
:::

## Recommended architecture
We recommend running the ThingsIX router in a scalable architecture, as the router will need to scale with the number of ThingsIX forwarders that are connecting to your router. Within ThingsIX for the demo console we use Kubernetes to scale-out our architecture. 

For each frequency-plan and NetID you can specify a separate FQDN (hostname) and port in the ThingsIX Router Registry. We recommend to setup a specific MQTT cluster per frequency-plan as this allows for distributing the load. However you can also run all the frequency-plans on a single MQTT cluster. This MQTT-cluster is used by Chirpstack to exchange the packets with the ThingsIX Forwarder.

Currently only Chirpstack is v4 is supported. Please let us know if you are looking for support for other Network Servers!

## Creating the configuration

Create a directory to hold the configuration:
```bash
mkdir /etc/thingix-router/
```

Generate a key for the router (in this example we are creating a key for eu868):
```bash
docker run --rm -v /etc/thingsix-router/:/etc/thingsix-router ghcr.io/thingsixfoundation/packet-handling/router:latest key generate /etc/thingsix-router/eu868.key
```
This will give the following output:
```bash
router key written to: /etc/thingsix-router/eu868.key
router id: d059a04407ca9683297bfbcb4236391c7f26406a71e11a51868b3b2ead0a64dc
```
Keep note of the router id, we will need it later. You can also find it by opening the key-file.

Create and fill the config (`/etc/thingsix-router/config.yaml`) with your configuration:
```yml
log:
    level: info      # [trace,debug,info,warn,error,fatal,panic]
    timestamp: true

router:
  keyfile: /etc/thingsix-router/$REGION.key

  forwarder:
    endpoint:
      host: 0.0.0.0
      port: 3200

  joinfiltergenerator:
    renew_interval: 5m
    chirpstack:
      # Enter global API key from Chirpstack
      api_key: $CHIRPSTACK_API_KEY
      # set to true for local connections
      insecure: true
      # target uses GRPC target naming "dns:<hostname>:<port>"
      target: dns:$CHIRPSTACK_HOST:$CHIRPSTACK_PORT

  integration:
    marshaler: protobuf
    mqtt:
      state_retained: true
      keep_alive: 30s
      max_reconnect_interval: 1m
      max_token_wait: 1s
      event_topic_template: $REGION/gateway/{{ .GatewayID }}/event/{{ .EventType }}
      command_topic_template: $REGION/gateway/{{ .GatewayID }}/command/#
      
      auth:
        generic:
          servers:
            - tcp://$MQTT_HOST:1883
          username: "$MQTT_USERNAME"
          password: "$MQTT_PASSWORD"
          clean_session: true

metrics:
    prometheus:
        address: 0.0.0.0:9090
        path: /metrics
```

Replace the `$VARIABLES` with the appropriate values for your environment. Make sure the topic-templates match with what's configured in the Chirstack region-specific configuration. 

Create a global API-key in Chirpstack (so not one in a tenant) and set it in the config. This API-key is used by the forwarder to get all the DevEUIs required the route joins. 

## Running the router

Now we can start and run the router:
```bash
docker run -d -p 3200:3200/tcp --restart unless-stopped -v /etc/thingsix-router/:/etc/thingsix-router --name router-eu868 ghcr.io/thingsixfoundation/packet-handling/router:1.0.0
```

Check the logs using
```bash
docker logs router-eu868
```

## Adding router in ThingsIX forwarder registry

Now contact ThingsIX Foundation (`info@thingix.com`) with your the hostname of your router, the NetID/DevAddr-prefix and frequency-plan and an address of the wallet that will pay for the airtime in the future (the owner). Please note that we will verify if you are allowed to use the NetID.