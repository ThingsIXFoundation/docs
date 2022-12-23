---
sidebar_position: 4
title: Airtime
---

# Introduction
Airtime is the time it takes to transmit or receive a LoRa® packet. Because data 
packets are broadcasted through the air every LoRa® device is competing for the 
same shared medium. The longer it takes for a packet to transfer over the air
the larger chunck of time it takes from available time. This makes airtime a 
good and fair measurement and used by ThingsIX to calculate data costs.

## Background
Airtime is a function of the size of a packet and how fast it can be transferred.
The size of a packet is pretty self explanatory, the larger the packet the 
longer it takes to transmit.

How fast a packet can be transferred requires understanding of several concepts.
This is by no means a definite explanation of these core LoRa® concepts but an
introduction that should be enough to get an understanding how airtime is 
calculated.

### Spreading factor
The first important factor to consider is the Spreading Factor (SF). Before data
can be transferred it needs to be converted into a signal that can be send 
through the air. This is done by modulating data into a Radio Frequency (RF) 
signal and demodulating it on the receiver side.

LoRa® uses the [Chirp Spread Spectrum](http://www.sghoslya.com/p/lora-is-chirp-spread-spectrum.html)
(CSS) for modulating data. Data is encoded into individual chirps (also called 
symbols) that are transmitted as a stream. How long it takes and how much data
a single chirp can contain is determined by the SP. LoRa® supports 6 spreading 
factors, named SF7, SF8, ..., SF12. To be complete, LoRa® also supports SP5 and
SP6 but both are not used for LoRaWAN packets that ThingsIX routes.

The most important factor is how long it takes to send a chirp. SF12 takes twice
as long to send a single chirp as SF11. SF11 takes twice as long as SP10, etc...
SF7 can therefore send `2**5` times more symbols in the same amount of time as
SF12.

The next thing to take into consideration is the amount of data each chirp 
contains. On SF7 each chirp contains 7 bits of data, on SF8 each chirp contains
8 bits of data, ..., SF12 chirps contain 12 bits of data. Therefore SF7 can
transfer slightly less than twice the amount of data than SF8 in the same time.

A lower SP has the benefit that data can be transferred faster and therefore
reduces power usage and airtime. The downside is that a lower SP is more 
susceptible to noise and as a result has lower range in comparison with a higher
SP.

### Bandwidth
The second important factor is bandwidth. LoRa® supports 3 different bands, 
125kHz, 250kHz and 500 kHz. Which combinations of spreading factors and bands
are available is described in a frequency plan. You can find the frequency
details [here](https://lora-alliance.org/resource_hub/rp2-101-lorawan-regional-parameters-2/).

With the same spreading factor a chirp send on 125kHz takes approximately 1/2
the time when it was send on 250kHz and 1/4 the time when it was send on 500kHz.
This is an approximation because LoRa® uses CSS to modulate data into chirps and
the frequency range per band results in that each chirp is not send exactly in a
frequency band that are a multiplies of each other.

### Code rate
While both the spreading factor and bandwidth control physical parameters the
code rate indicates how much error correction (FEC) is used for each data
transmission. LoRa® packets are transmitted over the air which is a shared 
medium. That makes each transmission susceptible to interference. LoRa® 
adds extra data (FEC) to each transmission that the receiver can use to detect 
and correct corrupt data.

The code rate indicates how much extra data is added. In environments with low 
interference a low code rate can be choosen while in environments with high
interference more FEC data can be picked. It therefore can make data 
transmissions more reliable in an environment with high interference at the
expense of larger packets.

## Calculating airtime
Calculating the airtime is a complex task but there are several online 
calculators available that make this job easy. You should now have a good enough
understanding about the factors that influence airtime and can use a 
[calculator](https://www.rfwireless-world.com/calculators/LoRaWAN-Airtime-calculator.html) 
to see the effect when changing settings.

:::tip
We just described key factors for LoRa® transmissions. End devices typically use
LoRaWAN. LoRaWAN is a protocol that is build on top of LoRa® and describes 
several types of messages and their format. This calculator uses LoRaWAN packets
to calculate airtime and shows the time it takes to transmit the payload and the
total packet.
:::