---
sidebar_position: 3
title: Routing Architecture
---
# Routing architecture

```mermaid
graph LR
    direction LR
        subgraph Option 2: Forwarder on Server: Gateway
        direction LR
        subgraph Gateway 2
        Packet2[LoRa Packet Forwarder]
        end 
        subgraph Server
        direction LR
        Forwarder2[ThingsIX Forwarder]
        end
        end
        subgraph Option 1: Forwarder on Gateway
        subgraph Gateway 1
        direction LR
            Packet1[LoRa Packet Forwarder] <--> |Semtech UDP| Forwarder1[ThingsIX Forwarder]
        end
        end
        Packet2 <--> |Semtech UDP| Forwarder2
    Forwarder1 <--GRPC based on NetID-->Router
    Forwarder2 <--GRPC based on NetID-->Router

    subgraph Router Operator
    Router[ThingsIX Router] <--> |MQTT and API| Chirpstack[Chirpstack V4]
    Router[ThingsIX Router] <-.-> LNS[LNS]
    end

    subgraph ThingsIX API
    RouterAPI
    end

    subgraph Polygon Blockchain
    RouterRegistry
    end

    RouterAPI --> RouterRegistry
    Forwarder1--> |HTTP API | RouterAPI
    Forwarder2--> |Direct Blockchain RPC|RouterRegistry

    Chirpstack <--> Application
    LNS <-.->  Application
```

# ThingsIX Forwarder
The ThingsIX Forwarder is responsible for receiving LoRa packets from the LoRa radio via the Semtech UDP protocol. 
The forwarder can either run on the Gateway itself (Option 1) or on a Server that receives Semtech UDP traffic from multiple
LoRa gateways on the same instance of the forwarder (Option 2). This last option allows the usage of any generic
LoRa gateway that supports Semtech UDP by pointing the Lora gateway to the server that runs the ThingsIX Forwarder. 

The ThingsIX Forwarder fetches a routing-table containing the NetIDs and DevAddr-prefixes of routers that are connected to 
ThingsIX from either the ThingsIX API or directly from the blockchain. Based on this information the ThingsIX Forwarder
is able to transmit uplink packets to the right router and receive downlinks over the same router. To get this by-directional
message flow, each forwarder opens a bidirectional GRPC stream with the router it needs to connect to.

To route Join-packets the Forwarder periodically requests a Xor16-filter containing the DevEUIs of the devices that need
to join a certain Router. 

# ThingsIX Router
The ThingsIX Router is responsible for receiving LoRa packets that are forwarded by ThingsIX Forwarders. It in turn forwards
the packets to the Network Server. Currently Chirpstack v4 is supported by the ThingsIX Router. As Chirpstack v4 uses MQTT
for exchanging packets, the ThingsIX Router uses MQTT to transmit and receive packets from Chirpstack. Additionally the
Router uses the Chirpstack API to get the DevEUIs of the connected devices. 