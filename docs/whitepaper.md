---
sidebar_position: 1
---

# Whitepaper

## Introduction
The number and variety of things (devices) connected to the internet has been growing rapidly over the last years. Especially with the introduction of new wireless technologies making it easy and cost-effective to connect devices to the internet. LoRa® is one of the latest examples of such wireless technology especially designed for connecting low-power things to the internet. LoRa® operates in the license-free bands and offers relative long-range (2-20km) wireless connectivity for devices that can operate for months on a single AA battery. 
To connect these LoRa® devices to the internet LoRa® gateways are used. LoRa® gateways have an internet-connection via wired or wireless (WiFi/LTE) uplinks and use an 8 channel radio to transceive packets from LoRa® devices (commonly called nodes). 
As with any wireless technology many connected things are roaming over the earth and crossing borders (for example for logistics use-cases) or are deployed by manufacturers in various countries. This requires a global LoRa® network with support for roaming. 
While some use-cases of internet-of-things are best-effort and don’t require a high level of availability of the network used, use-cases requiring a high level of availability and redundancy are also to be expected. 


> ThingsIX introduces a decentralized, crowd-sourced, incentivised, resilient, highly-available network for IoT devices using LoRa® technology that provides a high quality of service and coverage verified by end-device-like devices by using a mapper.

## Definitions
In this whitepaper we use a number of definitions:

- **Thing**: A wireless LoRa® IoT node or device that exchanges data
- **Gateway**: A wireless LoRa® base-station that exchanges data with Things over the LoRa® network to servers on the internet.
- **Router**: A service run by a Things-owner to receive and pay for data-traffic from their Things. Gateways will deliver this data-traffic at the right Routers. 

## Overview

ThingsIX itself is not yet another new blockchain, instead it uses commonly used, industry proven decentralized technology for its foundation. This provides a high level of resilience and availability while reducing the development-efforts required. 
The ThingsIX is designed for exchanging data with things. As a compensation for this data-exchange, the gateway-owner will receive compensation for the data it processed. This compensation, the cost of data-traffic, also serves as an important method to defer intentional or unintentional mis-usage of the wireless network as misusing the network will be economically infeasible. 
Things will only start using ThingsIX when there’s sufficient, reliable, coverage therefore gateway-owners should be incentivized to provide and grow coverage especially when data traffic is still limited. To do this ThingsIX introduces the concept of ThingsMapper, a Thing designed to securely allow for incentivised decentralized crowd-sourced mapping of the LoRa® wireless network coverage provided by Gateways connected to the ThingsIX network. This mapping provides a verified coverage by using thing-like devices. 

## Identities
To participate in the network participants need an identity. They can use an account (identified by an elliptic-curve public-key encoded into an address) on one of the supported blockchains. These blockchains are blockchains that support the requirements needed by ThingsIX:
- Support for fungible-tokens
- Validation of ECDSA signatures in smart-contracts
The support for various blockchains will develop over time, but at this time Polygon will be supported. 

Gateways are identified by a public-key of the ECDSA public/private-key-pair that should be generated specifically for a gateway installation. For performance and security reasons, the key-pair should be kept on the gateway (and not in the cloud), preferably secured using hardware-based non-exportable security-ICs. A gateway is the installation of a single LoRa® radio (concentrator) with a single antenna. Installations with multiple radio’s and/or multiple antennas should be added as multiple gateways. Any LoRa® gateway, including existing gateways that are currently used on other networks, can be added. No special requirements or an approval-process is needed. 

A participant can claim ownership of one or more gateways by executing an AddGateway transaction on the ThingsIX Gateway-smart-contract deployed on the blockchain networks supported by ThingsIX. To manufacture this transaction, the gateway first signs a transaction containing the public-key of the gateway and the address/public-key of the owner. Next the owner itself also signs this transaction and submits it to the network he is using. 
The owner of the gateway should also set the location, height above ground and the effective gain of the antenna used on the gateway using the SetLocation transaction. This transaction is only signed by the Owner, and can only be executed for gateways he owns. For encoding locations throughout ThingsIX the uber-h3 location-encoding system is used.  

Adding gateways costs 5 EUR in ThingsIX tokens according to the pricing smart-contract. Setting a location costs 15 EUR in ThingsIX tokens according to the pricing smart-contract. The prices will be increased every year by 3% as an indexation. These registration fees are burned. A location can be set multiple-times and can even be nullified.  As we will see later, the owner will receive compensation using ThingsIX-tokens for the data-traffic and the coverage the gateways he owns are providing. These ThingsIX tokens are a fungible-token (for example ERC20 on the Ethereum blockchain) that can be transmitted and exchanged. Initially Polygon will be used as the first blockchain because of the Ethereum Virtual Machine (EVM) compatibility and the swap functionality available that can be used for exchanging the tokens. 

## Airtime

Data-traffic is compensated by its airtime (hence the name), Airtime is calculated by the time a Gateway is busy receiving data from a Thing (uplink) or sending data to a Thing (downlink) in 10ms increments rounded up. 1 Airtime = 10ms of channel usage. This time is dependent on the data-rate used and the number of bytes transmitted. In addition, as downlinks block all 8 channels of a Gateway, downlinks are 8x as expensive as uplinks. This mechanism promotes fair and efficient usage of the network. 
Routers are used to receive data-traffic from Things delivered by Gateways to those Routers. The Routers pay for the reception. Next the Routers will route the data-traffic to applications or services on the internet by using standard protocols like (but not limited to) HTTP(S), GRPC and MQTT

There can be multiple routers on the network. Router-owners will submit the DNS-address of their routers to the network for a fee. All Routers are periodically polled by all Gateways to retrieve the xor16 filter and NetIds to match DevAddrs of Things according to the LoRaWAN protocol. Gateways will submit packets to all Routers that have a matching xor8 filter or LoRa® NetId. As the exchange of packets is time-critical, Routers have to pay Airtime for all packets matching the xor8 filter or NetId.  
Router-Owner locks Airtime in the Airtime smart-contract by sending ThingsIX-tokens to the smart-contract and appointing a Router public key that can spend the Airtime. The ThingsIX-tokens are converted into Airtime according to a rate as submitted to the pricing smart-contract. This results in Airtime having a fixed EUR/Airtime value. Airtime cannot be transferred, it can only be burned by the Airtime smart-contract operator (this can be smart-contract itself). 
Packets are exchanged between Gateway and Router. These packets are hash-chained by both the Router and the Gateway. The status of the hash-chain (current hash) is signed and exchanged by the Router and the Gateway verifying that they are in sync. Once every x time or y Airtime is paid using the latest signed status by both the Gateway and the Router as proof. Exposure is limited to Airtime earned from the last agreement. When a Router refuses to sign for the Airtime the Gateway stops forwarding packets. 
When Airtime is burned by the smart-contract operator upon receipt of the signed hash-chain the operator pays out the ThingsIX in the smart-contract based on the ratio of Airtime bought / ThingsIX locked. Therefore the ThingxIX balance will be exactly 0 when all Airtime is spent.

## Mapping Coverage
Gateway-owners are not only compensated for the data-traffic they exchange with Things. To build the network, they are also compensated for the coverage they provide. To do this, ThingsMappers are used. ThingsMappers are devices with secured GNSS (GPS, Galileo and so on) and LoRa® radio’s to make them tamper-resistant and secure. They have a ECDSA-key-pair embedded from the factory, and the corresponding public-key is registered. 
We acknowledge that it’s very hard to secure against physical attacks on hardware, therefore we expect that ThingsMappers will evolve over time and have a limited lifetime as new techniques such as cryptographically authenticated GNSS (Galileo OSNMA for example) come available. ThingsMappers should be secure against attacks that are economically feasible, not against all attacks. ThingsMappers will be distributed by the ThingsIX Foundation for usage by users, but will stay under the ownership of ThingsIX Foundation at any moment. 

The globe will be divided into a number of hexes according to resolution 3 of the Uber-H3 system. The world is divided into 41162 of such hexes of that resolution.. For each of the hexes a coverage manager will be appointed. This manager will be operated by the foundation initially. The same coverage manager can be appointed for multiple hexes when scaling out to this number is not required yet.  Later the ICP distributed computing platform will be evaluated. By using the threshold-cryptography functionality of ICP, a ECDSA keypair can be generated and kept in the canister. This keypair in the ICP canister in turn is used to sign “payout” receipts. The “payout” receipts are combined in a single canister and then signed again. The resulting overall receipt is submitted to the smart-contract on the blockchain. This smart-contract will verify the signature of the ICP canister and if it’s valid, initiate the payout in ThingsIX tokens. Like owners of a Gateway can claim ownership of a Gateway, holders of a ThingsMapper can claim that they are holding one or more ThingsMappers to get the rewards.

## Maintenance Tokens
To support initial and ongoing development, maintenance tokens are minted and sold by the ThingsIX foundation. These maintenance tokens are freely transferable. As a reward for buying the maintenance tokens and therefore supporting development of the network, a share of the rewards will be distributed to the maintenance token holders. 
These rewards can be used by the holders to support and fund further development in the network and network-related operations. 
Additionally the rewards are used to pay for the transaction and operational fees on the blockchains used. 

## Rewards
Rewards are allocated to all participants in the network. The following distribution is used:

|Percentage|Role|
|---|------|
|60%|Coverage Provided by Hotspots|
|20%|Coverage Mapped by Mappers|
|20%|Maintenance Tokens holders|


The rewards are funded by sources: 
Rewards are funded by initial token issuance: Initially 50.000 ThingsIX tokens will be issued every day. Every 4 years the issuance will be halved. This results in a total issuance of 146 million ThingsIX tokens  over time. This initial token issuance is used to bootstrap the network and seen as an investment by the participants to grow the network. 
Rewards over time will also be funded by a share of the proceedings received from the Airtime sale (for data-traffic). Initially 100% of the Airtime proceedings will go to the Gateways that processed the Airtime and 0% will be used for the rewards. After 4 years, 75% of the proceedings will go to the Gateways that processed the Airtime and 25% will be used for the rewards. After 8 years the split will be 50%/50% and after 12 years it will be 25%/75%. This will be the end-state, meaning that in the end for every Airtime that has been paid, 25% will go to the Gateways that processed the Airtime, and 75% will go into the reward pool for distribution according to the Reward distribution.

By using a share of the Airtime sale over time to reward not only the Airtime but also the rest of the network, the network stays sustainable in the long term. This is appropriate in our opinion because the users of the network use the network not just because that single Gateway processed the data-traffic, but also because there’s a network with certain coverage that's still being mapped and a network that is being maintained. In other words, the value of the IoT network is not just processing data-traffic, but also being available and usable. 

## Governance
The development and maintenance of the ThingsIX network will be funded by the ThingsIX Foundation, a non-profit organization. As discussed before, ThingsIX maintenance tokens will be sold and held by the foundation to fund initial and ongoing development. The ThingsIX foundation will distribute 75% of the ThingsIX maintenance tokens and hold 25% of the ThingsIX  maintenance tokens to fund ongoing maintenance, marketing and development. Of the 75%, 8% is allocated to the ThingsIX founders. 2% is allocated to the advisors.
The ThingsIX foundation is controlled by three directors. Each year a vote will be held amongst the ThingsIX maintenance token holders to propose a new director to replace the director (a director may be re-chosen indefinitely).

Changes regarding the network can be proposed via an Things Improvement Proposal (TIP) comparable to Ethereum’s EIP. TIPs should provide a proposal and proof-of-concept code (if applicable) to be acceptable. The opinion of the community abouts TIPs can be polled using a voting mechanism. However these votes are not binding as the final decision lies with the community-developers on what the implement. 


The LoRa® Mark is a trademark of Semtech Corporation or its subsidiaries.



